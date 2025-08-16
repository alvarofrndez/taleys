import { env } from "@/config/config_env"
import db from "@/database/connection"

export const userFollowModel = {
    getByUserFollowers: async (followed_id: number) => {
        /**
         *Obtiene el seguimiento de un usuarioa otro
         * 
         * @param {number} followed_id - ID del usuario que al que se le solicita el seguimiento.
         */

        const result = await db.query(
            `SELECT 
                *,
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at
            FROM ${env.DB_TABLE_USER_FOLLOWS}
            WHERE followed_id = $1`,
            [followed_id]
        )
        return result.rows
    },

    getByUserFollows: async (follower_id: number) => {
        /**
         *Obtiene el seguimiento de un usuarioa otro
         * 
         * @param {number} follower_id - ID del usuario que al que se le solicita el seguimiento.
         */

        const result = await db.query(
            `SELECT 
                *,
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at
            FROM ${env.DB_TABLE_USER_FOLLOWS}
            WHERE follower_id = $1`,
            [follower_id]
        )
        return result.rows
    },

    getByUsers: async (follower_id: number, followed_id: number) => {
        /**
         *Obtiene el seguimiento de un usuarioa otro
         * 
         * @param {number} follower_id - ID del usuario que solicita el seguimiento.
         * @param {number} followed_id - ID del usuario que al que se le solicita el seguimiento.
         */

        const result = await db.query(
            `SELECT 
                *,
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at
            FROM ${env.DB_TABLE_USER_FOLLOWS}
            WHERE follower_id = $1 AND followed_id = $2`,
            [follower_id, followed_id]
        )
        return result.rows[0]
    },
    
    follow: async (follower_id: number, followed_id: number) => {
        /**
         * Añade un seguimiento de un usuario a otro
         * 
         * @param {number} follower_id - ID del usuario que solicita el seguimiento.
         * @param {number} followed_id - ID del usuario que al que se le solicita el seguimiento.
         */
        const query = `
            INSERT INTO ${env.DB_TABLE_USER_FOLLOWS} (follower_id, followed_id) 
            VALUES ($1, $2)
        `
    
        const result = await db.query(query, [
            follower_id,
            followed_id
        ])
    
        return await userFollowModel.getByUsers(follower_id, followed_id)
    },

    unfollow: async (follower_id: number, followed_id: number) => {
        /**
         * Elimina un seguimiento de un usuario a otro
         * 
         * @param {number} follower_id - ID del usuario que solicita el seguimiento.
         * @param {number} followed_id - ID del usuario que al que se le solicita el seguimiento.
         */

        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_USER_FOLLOWS} WHERE follower_id = $1 AND followed_id = $2`,
            [follower_id, followed_id]
          )
          
        return result.rowCount
    },
}