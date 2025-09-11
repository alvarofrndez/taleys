CREATE TABLE IF NOT EXISTS character_appearances (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    character_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    appearance_note TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_character_appearances_character FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    CONSTRAINT fk_character_appearances_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    CONSTRAINT uq_character_appearance UNIQUE(character_id, book_id)
);

