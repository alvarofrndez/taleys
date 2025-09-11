CREATE TABLE IF NOT EXISTS characters (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    alias VARCHAR(150) NULL,
    age VARCHAR(50) NULL,
    gender VARCHAR(50) NULL,
    race_species VARCHAR(100) NULL,
    status ENUM('alive','dead','unknown') NOT NULL DEFAULT 'unknown',
    image_url TEXT NULL,

    belonging_level ENUM('project','universe','saga','book') NOT NULL,
    belonging_id BIGINT NOT NULL,

    biography TEXT NULL,
    motivations TEXT NULL,
    objectives TEXT NULL,
    fears TEXT NULL,
    strengths TEXT NULL,
    weaknesses TEXT NULL,
    profession VARCHAR(150) NULL,

    physical_description TEXT NULL,
    abilities TEXT NULL,
    limitations TEXT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

