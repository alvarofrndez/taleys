import { env } from '@/config/config_env'
import db from '@/database/connection'
import { ICharacter, ICharacterTimelineEventInput } from './character.interface'

export const characterModel = {
    getById: async (id: number) => {
        const result = await db.query(
            `
            SELECT *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
            FROM ${env.DB_TABLE_CHARACTERS}
            WHERE id = $1
            `,
            [id]
        )
        return result.rows[0]
    },

    getBySlug: async (slug: string) => {

        const result = await db.query(
            `
            SELECT *,
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
            FROM ${env.DB_TABLE_CHARACTERS}
            WHERE slug = $1
            `,
            [slug]
        )
        return result.rows[0]
    },

    getByBelonging: async (belonging_level: string, belonging_id: number, name: string) => {
        const result = await db.query(
            `
            SELECT *,
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
            FROM ${env.DB_TABLE_CHARACTERS}
            WHERE belonging_level = $1 AND belonging_id = $2 AND name = $3
            `,
            [belonging_level, belonging_id, name]
        )
        return result.rows[0]
    },

    getByBelongingAndSlug: async (belonging_level: string, belonging_id: number, slug: string) => {
        const result = await db.query(
            `
            SELECT *,
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
            FROM ${env.DB_TABLE_CHARACTERS}
            WHERE belonging_level = $1 AND belonging_id = $2 AND slug = $3
            `,
            [belonging_level, belonging_id, slug]
        )
        return result.rows[0]
    },

    getAllByProject: async (project_id: number) => {
        const result = await db.query(
            `
            SELECT *,
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
            FROM ${env.DB_TABLE_CHARACTERS}
            WHERE project_id = $1
            ORDER BY name ASC
            `,
            [project_id]
        )
        return result.rows
    }, 

    listByBelonging: async (belonging_level: string, belonging_id: number) => {
        const result = await db.query(
            `
            SELECT *,
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
            FROM ${env.DB_TABLE_CHARACTERS}
            WHERE belonging_level = $1 AND belonging_id = $2
            ORDER BY name ASC
            `,
            [belonging_level, belonging_id]
        )
        return result.rows
    },

    create: async (project_id: number, data: ICharacter) => {
        const result = await db.query(
            `
            INSERT INTO ${env.DB_TABLE_CHARACTERS}
            (project_id, name, slug, alias, age, gender, race_species, status, image_url,
             belonging_level, belonging_id,
             biography, motivations, objectives, fears, strengths, weaknesses, profession,
             physical_description, abilities, limitations)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
            RETURNING *
            `,
            [
                project_id, data.name, data.slug, data.alias ?? null, data.age ?? null, data.gender ?? null, data.race_species ?? null, data.status ?? 'unknown', data.image_url ?? null,
                data.belonging_level, data.belonging_id,
                data.biography ?? null, data.motivations ?? null, data.objectives ?? null, data.fears ?? null, data.strengths ?? null, data.weaknesses ?? null, data.profession ?? null,
                data.physical_description ?? null, data.abilities ?? null, data.limitations ?? null,
            ]
        )
        return result.rows[0]
    },

    update: async (id: number, data: Partial<ICharacter>) => {
        const result = await db.query(
            `
            UPDATE ${env.DB_TABLE_CHARACTERS}
            SET name=$1, slug=$2, alias=$3, age=$4, gender=$5, race_species=$6, status=$7, image_url=$8,
                belonging_level=$9, belonging_id=$10,
                biography=$11, motivations=$12, objectives=$13, fears=$14, strengths=$15, weaknesses=$16, profession=$17,
                physical_description=$18, abilities=$19, limitations=$20,
                updated_at = now()
            WHERE id=$21
            `,
            [
                data.name, data.slug, data.alias ?? null, data.age ?? null, data.gender ?? null, data.race_species ?? null, data.status ?? 'unknown', data.image_url ?? null,
                data.belonging_level, data.belonging_id,
                data.biography ?? null, data.motivations ?? null, data.objectives ?? null, data.fears ?? null, data.strengths ?? null, data.weaknesses ?? null, data.profession ?? null,
                data.physical_description ?? null, data.abilities ?? null, data.limitations ?? null,
                id
            ]
        )
        return result.rowCount
    },

    delete: async (id: number) => {
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_CHARACTERS} WHERE id = $1`,
            [id]
        )
        return result.rowCount
    },

    addAppearances: async (character_id: number, book_ids: number[]) => {
        if(book_ids.length === 0) return []
        const values = book_ids.map((_, i) => `($1, $${i+2})`).join(',')
        const params = [character_id, ...book_ids]
        const result = await db.query(
            `
            INSERT INTO ${env.DB_TABLE_CHARACTER_APPEARANCES} (character_id, book_id)
            VALUES ${values}
            ON CONFLICT (character_id, book_id) DO NOTHING
            RETURNING *
            `,
            params
        )
        return result.rows
    },

    listAppearances: async (character_id: number) => {
        const result = await db.query(
            `SELECT * FROM ${env.DB_TABLE_CHARACTER_APPEARANCES} WHERE character_id = $1 ORDER BY book_id ASC`,
            [character_id]
        )
        return result.rows
    },

    deleteAppearances: async (character_id: number) => {
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_CHARACTER_APPEARANCES} WHERE character_id = $1`,
            [character_id]
        )
        return result.rowCount
    },

    deleteAppearancesByBook: async (book_id: number) => {
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_CHARACTER_APPEARANCES} WHERE book_id = $1`,
            [book_id]
        )
        return result.rowCount
    },

    addRelationship: async (character_id: number, related_character_id: number, relation_type: string, note?: string) => {
        const result = await db.query(
            `
            INSERT INTO ${env.DB_TABLE_CHARACTER_RELATIONSHIPS} (character_id, related_character_id, relation_type, note)
            VALUES ($1,$2,$3,$4)
            ON CONFLICT (character_id, related_character_id, relation_type) DO UPDATE SET note = EXCLUDED.note
            RETURNING *
            `,
            [character_id, related_character_id, relation_type, note ?? null]
        )
        return result.rows[0]
    },

    listRelationships: async (character_id: number) => {
        const result = await db.query(
            `
            SELECT id, character_id, related_character_id, relation_type, note, created_at
            FROM ${env.DB_TABLE_CHARACTER_RELATIONSHIPS}
            WHERE character_id = $1
            ORDER BY created_at ASC
            `,
            [character_id]
        )
        return result.rows
    },

    deleteRelationships: async (character_id: number) => {
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_CHARACTER_RELATIONSHIPS} WHERE character_id = $1`,
            [character_id]
        )
        return result.rowCount
    },

    deleteRelatedRelationships: async (character_id: number) => {
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_CHARACTER_RELATIONSHIPS} WHERE related_character_id = $1`,
            [character_id]
        )
        return result.rowCount
    },

    setTimeline: async (character_id: number, events: ICharacterTimelineEventInput[]) => {
        await db.query('BEGIN')
        try {
            await db.query(`DELETE FROM ${env.DB_TABLE_CHARACTER_TIMELINE} WHERE character_id = $1`, [character_id])
            for(const event of events){
                await db.query(
                    `
                    INSERT INTO ${env.DB_TABLE_CHARACTER_TIMELINE} (character_id, book_id, event_order, title, description)
                    VALUES ($1,$2,$3,$4,$5)
                    `,
                    [character_id, event.book_id ?? null, event.event_order, event.title, event.description ?? null]
                )
            }
            await db.query('COMMIT')
        } catch (error) {
            await db.query('ROLLBACK')
            throw error
        }
    },

    getTimeline: async (character_id: number) => {
        const result = await db.query(
            `
            SELECT id, book_id, event_order, title, description, created_at
            FROM ${env.DB_TABLE_CHARACTER_TIMELINE}
            WHERE character_id = $1
            ORDER BY event_order ASC
            `,
            [character_id]
        )
        return result.rows
    },

    clearTimeline: async (character_id: number) => {
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_CHARACTER_TIMELINE} WHERE character_id = $1`,
            [character_id]
        )
        return result.rowCount
    },
}