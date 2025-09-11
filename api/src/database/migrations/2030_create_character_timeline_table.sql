CREATE TABLE IF NOT EXISTS character_timeline (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    character_id BIGINT NOT NULL,
    book_id BIGINT NULL,
    event_order INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_character_timeline_character FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    CONSTRAINT fk_character_timeline_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE SET NULL,
    CONSTRAINT uq_character_timeline_order UNIQUE(character_id, event_order)
);

