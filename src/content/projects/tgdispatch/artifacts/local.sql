-- Локальное хранилище TgDispatch (SQLite): outbox задач для Notion и известные боту пользователи.

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    deadline TEXT,
    priority TEXT NOT NULL,
    assignee TEXT,
    category TEXT NOT NULL,
    author_username TEXT,
    created_at TEXT NOT NULL,
    synced_to_notion INTEGER NOT NULL DEFAULT 0,
    notion_page_url TEXT
);

-- Все, кто хоть раз написал боту: только им бот может прислать уведомление о задаче.
CREATE TABLE IF NOT EXISTS known_users (
    telegram_user_id INTEGER PRIMARY KEY,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    updated_at TEXT NOT NULL
);

-- Outbox: задачи, ещё не доехавшие до Notion
SELECT * FROM tasks WHERE synced_to_notion = 0 ORDER BY id ASC;
