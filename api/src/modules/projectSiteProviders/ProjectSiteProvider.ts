import { env } from '@/config/config_env'
import db from '@/database/connection'

export const projectSiteProviderModel = {
    getById: async (id: number) => {
        const result = await db.query(
            `SELECT * FROM ${env.DB_TABLE_PROJECT_SITE_PROVIDERS} WHERE id = $1`,
            [id]
        )
        return result.rows[0]
    },

    getByValue: async (value: string) => {
        const result = await db.query(
            `SELECT * FROM ${env.DB_TABLE_PROJECT_SITE_PROVIDERS} WHERE value = $1`,
            [value]
        )
        return result.rows[0]
    },

    getAll: async () => {
        const result = await db.query(
            `SELECT * FROM ${env.DB_TABLE_PROJECT_SITE_PROVIDERS}`,
        )
        return result.rows
    }
}