-- ТехРент: миграции заказов (backend/internal/database/migrations)

-- ===== 000004_create_orders.up.sql =====
CREATE TABLE orders (
    id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Читаемый номер заказа: ТР-2024-001. Генерируется в бизнес-логике, не в БД
    number         VARCHAR(50)   UNIQUE NOT NULL,
    client_id      UUID          REFERENCES clients(id) ON DELETE SET NULL,
    object_id      UUID          REFERENCES objects(id) ON DELETE SET NULL,
    equipment_id   UUID          REFERENCES equipment(id) ON DELETE SET NULL,
    manager_id     UUID          REFERENCES users(id) ON DELETE SET NULL,
    driver_name    VARCHAR(255),
    driver_phone   VARCHAR(50),
    status         VARCHAR(50)   NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
    start_date     DATE          NOT NULL,
    end_date       DATE          NOT NULL,
    daily_rate     NUMERIC(12, 2) NOT NULL DEFAULT 0,
    shift_rate     NUMERIC(12, 2),
    total_amount   NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    paid_amount    NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
    payment_status VARCHAR(50)   NOT NULL DEFAULT 'unpaid'
                   CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
    notes          TEXT,
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

    CONSTRAINT orders_dates_check CHECK (end_date >= start_date)
);

CREATE INDEX idx_orders_client_id      ON orders(client_id);
CREATE INDEX idx_orders_equipment_id   ON orders(equipment_id);
CREATE INDEX idx_orders_status         ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
-- Индекс по датам - критичен для проверки конфликтов и календаря
CREATE INDEX idx_orders_dates          ON orders(start_date, end_date);

-- ===== 000007_orders_hourly.up.sql =====
-- Убираем ставку за смену, добавляем почасовую ставку и кол-во часов в заказы
ALTER TABLE orders
    DROP COLUMN IF EXISTS shift_rate,
    ADD COLUMN hourly_rate NUMERIC(12, 2) CHECK (hourly_rate >= 0),
    ADD COLUMN hours       INTEGER         CHECK (hours > 0);

-- Убираем ставку за смену из техники
ALTER TABLE equipment
    DROP COLUMN IF EXISTS shift_rate;

-- ===== 000009_orders_planned_status.up.sql =====
-- Переход с ручных статусов (draft/active/completed) на вычисляемые по датам.
-- В БД хранятся только 'planned' и 'cancelled'; active/completed вычисляются в запросах.

-- Сначала снимаем старый constraint, чтобы UPDATE не нарушал его
ALTER TABLE orders DROP CONSTRAINT orders_status_check;

-- Переименовываем все нефинальные статусы в 'planned'
UPDATE orders SET status = 'planned' WHERE status IN ('draft', 'active', 'completed');

-- Устанавливаем новый default и constraint
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'planned';
ALTER TABLE orders ADD CONSTRAINT orders_status_check
    CHECK (status IN ('planned', 'cancelled'));

-- ===== 000011_orders_no_overlap.up.sql =====
-- Защита от двойного бронирования на уровне БД.
-- Два незакрытых заказа (status = 'planned') на одну технику не могут пересекаться по датам.
-- Даты включительные: '[]' — заказ до 12.10 и заказ с 12.10 конфликтуют.
-- Заказы без техники (equipment_id IS NULL) не ограничиваются: NULL = NULL не даёт совпадения.

-- btree_gist нужен, чтобы в одном GiST-индексе сравнивать uuid через "=" и диапазоны через "&&"
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Если в данных уже есть пересечения, ограничение не создастся.
-- Сообщаем номера конфликтующих заказов вместо общей ошибки PostgreSQL.
DO $$
DECLARE
    conflicts TEXT;
BEGIN
    SELECT string_agg(a.number || ' и ' || b.number, '; ')
      INTO conflicts
      FROM orders a
      JOIN orders b
        ON a.equipment_id = b.equipment_id
       AND a.id < b.id
       AND a.status = 'planned'
       AND b.status = 'planned'
       AND a.start_date <= b.end_date
       AND b.start_date <= a.end_date;

    IF conflicts IS NOT NULL THEN
        RAISE EXCEPTION 'Найдены пересекающиеся заказы на одну технику: %. Отмените или перенесите их и перезапустите приложение', conflicts;
    END IF;
END $$;

ALTER TABLE orders ADD CONSTRAINT orders_equipment_no_overlap
    EXCLUDE USING gist (
        equipment_id                            WITH =,
        daterange(start_date, end_date, '[]')   WITH &&
    ) WHERE (status = 'planned');

-- ===== 000012_order_counters.up.sql =====
-- Счётчик номеров заказов по годам: ТР-<year>-<last_value>.
-- Раньше номер считался как COUNT(*) + 1 за год: после удаления заказа номер повторялся (UNIQUE → 500),
-- а одновременные создания получали одинаковый номер.
-- Счётчик только растёт, поэтому номер удалённого заказа больше никогда не выдаётся.
CREATE TABLE order_counters (
    year       INT PRIMARY KEY,
    last_value INT NOT NULL CHECK (last_value >= 0)
);

-- Начальные значения — максимальный существующий номер за каждый год
INSERT INTO order_counters (year, last_value)
SELECT substring(number FROM 4 FOR 4)::int,
       MAX(substring(number FROM 9)::int)
  FROM orders
 WHERE number ~ '^ТР-[0-9]{4}-[0-9]+$'
 GROUP BY 1;
