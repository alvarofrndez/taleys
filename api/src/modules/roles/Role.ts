import db from '@/database/connection'
import { env } from '@/config/config_env'

export const roleModel = {
    getIdByType: async (type: string) => {
        const result = await db.query(
            `SELECT id FROM ${env.DB_TABLE_ROLES} WHERE type = $1`,
            [type]
        )
        return result.rows[0].id
    },

    getPriorityById: async (id: number) => {
        const result = await db.query(
            `SELECT priority FROM ${env.DB_TABLE_ROLES} WHERE id = $1`,
            [id]
        )
        return result.rows[0].priority
    },

    getPriorityByType: async (type: string) => {
        const result = await db.query(
            `SELECT priority FROM ${env.DB_TABLE_ROLES} WHERE type = $1`,
            [type]
        )
        return result.rows[0].priority
    },
}