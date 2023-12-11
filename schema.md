CREATE TABLE users (
    id TEXT PRIMARY KEY,
    user_id INTEGER UNIQUE,
    created_at INTEGER,
    username TEXT
);

CREATE TABLE content (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    key TEXT,
    value TEXT,
    timestamp INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);