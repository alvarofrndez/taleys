CREATE TABLE IF NOT EXISTS character_relationships (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    character_id BIGINT NOT NULL,
    related_character_id BIGINT NOT NULL,
    relation_type VARCHAR(50) NOT NULL,
    note TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_character_relations_character FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    CONSTRAINT fk_character_relations_related FOREIGN KEY (related_character_id) REFERENCES characters(id) ON DELETE CASCADE,
    CONSTRAINT uq_character_relation UNIQUE(character_id, related_character_id, relation_type)
);

