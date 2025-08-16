import IUsersAuthProviders from './usersAuthProviders.interface'
import db from '@/database/connection'
import { env } from '@/config/config_env'

export const usersAuthProvidersModel = {
    getByProvider: async (user_id: number, provider: string) => {
        const query = `SELECT * FROM ${env.DB_TABLE_USERS_AUTH_PROVIDERS} WHERE user_id = $1 AND provider = $2`

        const result = await db.query(query, [user_id, provider])

        return result.rows[0]
    },

    setProvider: async (account: IUsersAuthProviders) => {
        const query = `
            INSERT INTO ${env.DB_TABLE_USERS_AUTH_PROVIDERS} (user_id, provider, provider_id) 
            VALUES ($1, $2, $3)
            RETURNING id
        `

        const result = await db.query(query, [
            account.user_id,
            account.provider,
            account.provider_id
        ])

        return result.rowCount
    },
}