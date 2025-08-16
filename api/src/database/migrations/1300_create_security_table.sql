CREATE TABLE IF NOT EXISTS security (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    is_2fa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    2fa_secret TEXT NULL,
    2fa_backup_codes TEXT NULL,
    2fa_method ENUM('TOTP', 'EMAIL', 'SMS') NOT NULL,
    phone_number VARCHAR(20) NULL,
    last_login_ip VARCHAR(45) NULL,
    failed_attempts INT NOT NULL DEFAULT 0,
    
    CONSTRAINT fk_security_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)