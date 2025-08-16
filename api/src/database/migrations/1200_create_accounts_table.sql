CREATE TABLE IF NOT EXISTS users_auth_providers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    provider VARCHAR(30) NOT NULL,
    provider_id TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
)