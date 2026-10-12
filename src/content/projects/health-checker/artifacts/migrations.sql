-- Website Health Monitor: миграции PostgreSQL (internal/storage/migrations, вшиты в бинарник через embed).
-- Применяются при старте, каждая в своей транзакции, с учётом в schema_migrations и advisory-блокировкой.

-- ===== 0001_init.sql =====
-- Исходная схема (как её создавала первая версия сервиса). IF NOT EXISTS — чтобы
-- миграции корректно применялись и к новой базе, и к базе, созданной старой версией.
CREATE TABLE IF NOT EXISTS health_checks (
    id SERIAL PRIMARY KEY,
    target_id INT,
    url TEXT,
    status_code INT,
    response_time_ms INT,
    error_msg TEXT,
    created_at TIMESTAMP
);

-- ===== 0002_health_checks_v2.sql =====
-- Время с часовым поясом. Старые записи считаем записанными в UTC (так работал контейнер).
ALTER TABLE health_checks RENAME COLUMN created_at TO checked_at;
ALTER TABLE health_checks ALTER COLUMN checked_at TYPE TIMESTAMPTZ USING checked_at AT TIME ZONE 'UTC';
UPDATE health_checks SET checked_at = now() WHERE checked_at IS NULL;
ALTER TABLE health_checks ALTER COLUMN checked_at SET NOT NULL;
ALTER TABLE health_checks ALTER COLUMN checked_at SET DEFAULT now();

-- Отсутствие значения — NULL, а не пустая строка / 0.
ALTER TABLE health_checks RENAME COLUMN error_msg TO error;
UPDATE health_checks SET error = NULL WHERE error = '';
UPDATE health_checks SET status_code = NULL WHERE status_code = 0;

-- Явный вердикт проверки. Для старых записей: успех = нет ошибки и код 2xx.
ALTER TABLE health_checks ADD COLUMN is_up BOOLEAN;
UPDATE health_checks SET is_up = (error IS NULL AND status_code BETWEEN 200 AND 299);
UPDATE health_checks SET error = 'неожиданный HTTP-код ' || status_code
    WHERE NOT is_up AND error IS NULL AND status_code IS NOT NULL;
ALTER TABLE health_checks ALTER COLUMN is_up SET NOT NULL;

DELETE FROM health_checks WHERE target_id IS NULL OR url IS NULL;
ALTER TABLE health_checks ALTER COLUMN target_id SET NOT NULL;
ALTER TABLE health_checks ALTER COLUMN url SET NOT NULL;
UPDATE health_checks SET response_time_ms = 0 WHERE response_time_ms IS NULL;
ALTER TABLE health_checks ALTER COLUMN response_time_ms SET NOT NULL;

-- История одной цели и выборки по диапазону времени для Grafana / очистки старых данных.
CREATE INDEX health_checks_target_checked_idx ON health_checks (target_id, checked_at DESC);
CREATE INDEX health_checks_checked_at_idx ON health_checks (checked_at);

-- ===== 0003_targets.sql =====
-- Цели мониторинга. NULL в interval_seconds / timeout_seconds / expected_status —
-- использовать значения по умолчанию (CHECK_INTERVAL, CHECK_TIMEOUT, любой 2xx).
CREATE TABLE targets (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK (name <> ''),
    url TEXT NOT NULL CHECK (url ~ '^https?://'),
    expected_status INT CHECK (expected_status BETWEEN 100 AND 599),
    keyword TEXT,
    headers JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(headers) = 'object'),
    interval_seconds INT CHECK (interval_seconds > 0),
    timeout_seconds INT CHECK (timeout_seconds > 0),
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Цели, которые раньше были захардкожены в коде, переносим в таблицу, чтобы сохранить историю проверок.
INSERT INTO targets (id, name, url)
SELECT DISTINCT ON (target_id) target_id, url, url
FROM health_checks
WHERE target_id > 0 AND url ~ '^https?://'
ORDER BY target_id, checked_at DESC;

SELECT setval(pg_get_serial_sequence('targets', 'id'), COALESCE((SELECT max(id) FROM targets), 0) + 1, false);

-- История удаляется вместе с целью.
DELETE FROM health_checks WHERE target_id NOT IN (SELECT id FROM targets);
ALTER TABLE health_checks
    ADD CONSTRAINT health_checks_target_id_fkey
    FOREIGN KEY (target_id) REFERENCES targets (id) ON DELETE CASCADE;
