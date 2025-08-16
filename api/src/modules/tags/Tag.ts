import { env } from '@/config/config_env'
import db from '@/database/connection'
import { ITag } from './tag.interface'

export const tagModel = {
    getById: async (id: number) => {
        const result = await db.query(
            `SELECT * FROM ${env.DB_TABLE_TAGS} WHERE id = $1`,
            [id]
        )
        return result.rows[0]
    },

    getByValue: async (value: string) => {
        const result = await db.query(
            `SELECT * FROM ${env.DB_TABLE_TAGS} WHERE value = $1`,
            [value]
        )
        return result.rows[0]
    },

    create: async (data: ITag) => {
        const result = await db.query(
            `
            INSERT INTO ${env.DB_TABLE_TAGS} 
                (value)
            VALUES 
                ($1)
            RETURNING *
            `,
            [data.value]
        )

        return result.rows[0]
    }
}  