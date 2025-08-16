import { env } from '@/config/config_env'
import db from '@/database/connection'

export const projectCategoryTypeModel = {
    getById: async (id: number) => {
        const result = await db.query(
            `SELECT * FROM ${env.DB_TABLE_PROJECT_CATEGORY_TYPES} WHERE id = $1`,
            [id]
        )
        return result.rows[0]
    },


    getByValue: async (value: string) => {
        const result = await db.query(
            `SELECT * FROM ${env.DB_TABLE_PROJECT_CATEGORY_TYPES} WHERE value = $1`,
            [value]
        )
        return result.rows[0]
    },

    getAll: async () => {
        const result = await db.query(
            `SELECT * FROM ${env.DB_TABLE_PROJECT_CATEGORY_TYPES}`,
        )
        return result.rows
    }
}