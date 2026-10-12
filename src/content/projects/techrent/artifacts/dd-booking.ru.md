Таблицы, которые участвуют в бронировании, в итоговом состоянии после всех миграций. Обязательность: **да** — `NOT NULL`, **нет** — NULL допустим.

## orders — заказы

Заказ — бронь одной единицы техники на период для клиента.

| Поле | Тип | Обяз. | Ограничения | Бизнес-смысл |
| --- | --- | --- | --- | --- |
| `id` | UUID | да | PK | Идентификатор заказа |
| `number` | VARCHAR(50) | да | UNIQUE | Номер для людей: `ТР-2026-015`. Выдаёт сервер из счётчика `order_counters` |
| `client_id` | UUID | нет | FK → `clients`, `ON DELETE SET NULL` | Клиент-арендатор |
| `object_id` | UUID | нет | FK → `objects`, `ON DELETE SET NULL` | Стройплощадка, куда едет техника |
| `equipment_id` | UUID | нет | FK → `equipment`, `ON DELETE SET NULL` | Бронируемая техника. Если пусто, проверки доступности не выполняются |
| `manager_id` | UUID | нет | FK → `users`, `ON DELETE SET NULL` | Ответственный менеджер. Сейчас не заполняется (З-9) |
| `driver_name` | VARCHAR(255) | нет | — | ФИО водителя (машиниста) |
| `driver_phone` | VARCHAR(50) | нет | — | Телефон водителя для клиента |
| `status` | VARCHAR(50) | да | `planned` или `cancelled`, по умолчанию `planned` | Заказ действует или отменён. Эффективный статус вычисляется (см. ниже) |
| `start_date` | DATE | да | — | Первый день аренды, включительно |
| `end_date` | DATE | да | Не раньше `start_date` | Последний день аренды, включительно |
| `daily_rate` | NUMERIC(12,2) | да | По умолчанию 0 | Ставка за день на момент оформления |
| `hourly_rate` | NUMERIC(12,2) | нет | ≥ 0 | Ставка за час на момент оформления |
| `hours` | INTEGER | нет | > 0 | Часы при однодневной аренде |
| `total_amount` | NUMERIC(12,2) | да | ≥ 0 | Итоговая сумма, ₽. Считает форма, менеджер может изменить |
| `paid_amount` | NUMERIC(12,2) | да | ≥ 0 | Сколько оплачено. Пересчитывается при каждой операции с платежами |
| `payment_status` | VARCHAR(50) | да | `unpaid`, `partial`, `paid` | Ничего не оплачено / частично / полностью |
| `notes` | TEXT | нет | — | Примечание |
| `created_at`, `updated_at` | TIMESTAMPTZ | да | По умолчанию `NOW()` | Служебные даты |

**Ограничение от двойного бронирования** `orders_equipment_no_overlap`: два заказа со статусом `planned` на одну технику не могут пересекаться по датам (`EXCLUDE USING gist`, границы включительные). Заказы без техники не ограничиваются.

**Историческая справка.** Ставка за смену заменена на почасовую ставку и часы; статусы `draft`, `active`, `completed` сведены к `planned`.

## order_counters — счётчик номеров

| Поле | Тип | Обяз. | Ограничения | Бизнес-смысл |
| --- | --- | --- | --- | --- |
| `year` | INT | да | PK | Год, для которого ведётся нумерация |
| `last_value` | INT | да | ≥ 0 | Последний выданный порядковый номер |

Номер выдаётся внутри транзакции заказа: `INSERT … ON CONFLICT (year) DO UPDATE SET last_value = GREATEST(last_value + 1, <максимальный существующий> + 1)`. Счётчик только растёт и откатывается вместе с заказом.

## equipment — техника

Для бронирования важны статус, даты обслуживания и ставки.

| Поле | Тип | Обяз. | Ограничения | Бизнес-смысл |
| --- | --- | --- | --- | --- |
| `id` | UUID | да | PK | Идентификатор |
| `name` | VARCHAR(255) | да | — | «Экскаватор-погрузчик JCB 3CX» |
| `brand`, `model` | VARCHAR(255) | нет | — | Марка и модель; по ним, как и по названию, работает поиск |
| `category` | VARCHAR(100) | нет | — | Вид техники, виден в календаре. Интерфейс даёт выбрать одно из 10 значений (О-2) |
| `status` | VARCHAR(50) | да | `available`, `rented`, `maintenance`, `broken` | `broken` запрещает бронь (422) и скрывает технику из календаря |
| `daily_rate` | NUMERIC(12,2) | да | ≥ 0 | Ставка за день, подставляется в форму заказа |
| `hourly_rate` | NUMERIC(12,2) | нет | ≥ 0 | Ставка за час |
| `maintenance_from` | DATE | нет | Обязательно при `maintenance` | Начало планового обслуживания |
| `maintenance_to` | DATE | нет | Не раньше `maintenance_from` | Конец обслуживания. Пересечение заказа с периодом — 409 |

При смене статуса на любой, кроме `maintenance`, даты обслуживания обнуляются. Строка техники блокируется (`FOR UPDATE`) и при бронировании, и при переводе на обслуживание — эти операции для одной машины идут строго по очереди.

## clients и objects — клиенты и их площадки

| Таблица | Ключевые поля | Бизнес-смысл |
| --- | --- | --- |
| `clients` | `type` (`legal` или `individual`), `name`, `contact_person`, `phone`, `email`, `inn`, адреса | Юрлицо или физлицо. `name` попадает в заказ как `client_name`. Поиск по телефону не зависит от форматирования: `22-33` находит `+7 (495) 111-22-33` |
| `objects` | `client_id` (FK, `SET NULL`), `name`, `address`, `contact_person`, `phone`, `is_active` | Стройплощадка клиента. Что объект заказа принадлежит клиенту заказа, сервер не проверяет |

## users — пользователи

| Поле | Тип | Обяз. | Бизнес-смысл |
| --- | --- | --- | --- |
| `email` | VARCHAR(255), UNIQUE | да | Логин |
| `password_hash` | VARCHAR(255) | да | bcrypt-хеш пароля |
| `full_name` | VARCHAR(255) | да | Попадает в заказ как `manager_name` |
| `role` | `admin` или `manager` | да | Роль |
| `permissions` | JSONB | нет | Права менеджера по модулям, для заказов `{"orders": {"edit", "delete", "cancel"}}`. Попадают в JWT при входе |
| `status` | `active` или `pending` | да | `pending` — приглашён, но ещё не задал пароль; вход заблокирован |
| `invite_token`, `invite_expires_at` | VARCHAR(64), TIMESTAMPTZ | нет | Одноразовое приглашение на 7 дней; частичный уникальный индекс |
| `telegram_chat_id` | BIGINT | нет | Зарезервировано под уведомления |

## audit_log — журнал действий

| Поле | Тип | Бизнес-смысл |
| --- | --- | --- |
| `user_id`, `user_email` | UUID, VARCHAR | Кто совершил действие. Email сохраняется, даже если пользователя удалят |
| `action` | VARCHAR(50) | `CREATE`, `UPDATE`, `DELETE`. Отмена заказа — `UPDATE` |
| `entity_type`, `entity_id` | VARCHAR | Для фичи — `order` и id заказа |
| `old_data`, `new_data` | JSONB | Заказ до и после. При отмене — `{"status": "<старый>"}` и `{"status": "cancelled"}` |
| `ip_address` | VARCHAR(50) | IP пользователя |
| `created_at` | TIMESTAMPTZ | Время события |

## Вычисляемые поля API

| Поле | Как вычисляется |
| --- | --- |
| `status` | `CASE WHEN status = 'cancelled' THEN 'cancelled' WHEN CURRENT_DATE < start_date THEN 'planned' WHEN CURRENT_DATE > end_date THEN 'completed' ELSE 'active' END` |
| `client_name`, `object_name`, `equipment_name`, `manager_name` | Подзапросы к справочникам по внешним ключам |
| Календарь | Неотменённые заказы, пересекающиеся с `[from, to]`, сгруппированные по технике; техника `broken` исключена |

`CURRENT_DATE` берётся по часовому поясу сервера БД, поэтому «Активен» и «Завершён» меняются в полночь по времени сервера.

**Правило пересечения.** Периоды `[A_start, A_end]` и `[B_start, B_end]` пересекаются, если `A_start <= B_end AND A_end >= B_start`. Используется в проверке конфликта заказов, проверке обслуживания и выборке календаря.

## Индексы

| Индекс | Поля | Зачем |
| --- | --- | --- |
| `orders_number_key` | `number`, UNIQUE | Уникальность номера |
| `orders_equipment_no_overlap` | `equipment_id`, `daterange(start_date, end_date)`, GiST | Запрет пересечений и быстрый поиск конфликтов |
| `idx_orders_equipment_id` | `equipment_id` | Заказы конкретной техники |
| `idx_orders_dates` | `start_date`, `end_date` | Календарь за период |
| `idx_orders_payment_status` | `payment_status` | Фильтр по оплате, должники |
| `idx_equipment_status` | `status` | Календарь исключает `broken` |
| `idx_audit_log_entity` | `entity_type`, `entity_id` | История изменений заказа |
| `idx_audit_log_created_at` | `created_at DESC` | Журнал от новых событий к старым |
