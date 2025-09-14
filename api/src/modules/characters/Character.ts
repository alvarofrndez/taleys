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
            (project_id, name, slug, alias, biography, image_url,
             belonging_level, belonging_id)
            VALUES ($1,$2,$3,$4,$5,$6,$7, $8)
            RETURNING *
            `,
            [
                project_id, data.name, data.slug, data.alias ?? null, data.biography ?? null, data.image_url ?? null,
                data.belonging_level, data.belonging_id,
            ]
        )
        return result.rows[0]
    },

    update: async (id: number, data: Partial<ICharacter>) => {
        const result = await db.query(
            `
            UPDATE ${env.DB_TABLE_CHARACTERS}
            SET name=$1, slug=$2, alias=$3, biography=$4, image_url=$5,
                belonging_level=$6, belonging_id=$7,
                updated_at = now()
            WHERE id=$8
            `,
            [
                data.name, data.slug, data.alias ?? null, data.biography ?? null, data.image_url ?? null,
                data.belonging_level, data.belonging_id,
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

    getExtraAttributes: async (character_id: number) => {
        const result = await db.query(
            `SELECT * FROM ${env.DB_TABLE_CHARACTER_EXTRA_ATTRIBUTES} WHERE character_id = $1`,
            [character_id]
        )
        return result.rows
    },

    addExtraAttributes: async (character_id: number, extra_attributes: { key: string, value: string }[]) => {
        if (extra_attributes.length === 0) return []

        const params: any[] = []
        const values: string[] = []

        extra_attributes.forEach((attr, index) => {
            const param_index_start = index * 3
            values.push(`($${param_index_start + 1}, $${param_index_start + 2}, $${param_index_start + 3})`)
            params.push(character_id, attr.key, attr.value)
        })

        const result = await db.query(
            `
            INSERT INTO ${env.DB_TABLE_CHARACTER_EXTRA_ATTRIBUTES} (character_id, key, value)
            VALUES ${values.join(', ')}
            RETURNING *
            `,
            params
        )

        return result.rows
    },
    
    updateExtraAttributes: async (character_id: number, extra_attributes: any[]) => {
        if (extra_attributes.length === 0) return []

        const results: any[] = []

        for (const attr of extra_attributes) {
            const res = await db.query(
                `
                UPDATE ${env.DB_TABLE_CHARACTER_EXTRA_ATTRIBUTES}
                SET value = $1
                WHERE character_id = $2 AND key = $3
                RETURNING *
                `,
                [attr.value, character_id, attr.key]
            )
            results.push(...res.rows)
        }

        return results
    },

    deleteExtraAttribute: async (character_id: number, key: string) => {
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_CHARACTER_EXTRA_ATTRIBUTES} WHERE character_id = $1 AND key = $2`,
            [character_id, key]
        )
        return result.rowCount
    },

    deleteExtraAttributes: async (character_id: number, keys: string[]) => {
        if (keys.length === 0) return []

        const params = [character_id, keys]
        const result = await db.query(
            `
            DELETE FROM ${env.DB_TABLE_CHARACTER_EXTRA_ATTRIBUTES}
            WHERE character_id = $1 AND key = ANY($2::text[])
            RETURNING *
            `,
            params
        )

        return result.rows
    },

    deleteAllExtraAttributes: async (character_id: number) => {
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_CHARACTER_EXTRA_ATTRIBUTES} WHERE character_id = $1`,
            [character_id]
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

    getRelationshipById: async (id: number) => {
        const result = await db.query(
            `
            SELECT *
            FROM ${env.DB_TABLE_CHARACTER_RELATIONSHIPS}
            WHERE id = $1
            `,
            [id]
        )
        return result.rows[0]
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

    deleteRelationship: async (id: number) => {
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_CHARACTER_RELATIONSHIPS} WHERE id = $1`,
            [id]
        )
        return result.rowCount
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