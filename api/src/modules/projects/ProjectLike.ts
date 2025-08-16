import { env } from '@/config/config_env'
import db from '@/database/connection'

export const projectLikeModel = {
    getByProject: async (project_id: number) => {
        /**
         * Obtiene los likes de un proyecto.
         * 
         * @param {number} project_id - ID del proyecto.
         * @returns {IProjectProjectLike[]} Los likes encontrado o `null` si no existe.
         */
        const result = await db.query(
        `
            SELECT * FROM ${env.DB_TABLE_PROJECT_LIKES}
            WHERE project_id = $1
        `,
        [project_id]
        )

        return result.rows
    },

    getByProjectAndUser: async (project_id: number, user_id: number) => {
        /**
         * Obtiene el "like" de un proyecto dado por un usuario.
         * 
         * @param {number} project_id - ID del proyecto.
         * @param {number} user_id - ID del usuario.
         * @returns {Object|null} El like encontrado o `null` si no existe.
         */
        const result = await db.query(
        `
            SELECT * FROM ${env.DB_TABLE_PROJECT_LIKES}
            WHERE project_id = $1 AND user_id = $2
        `,
        [project_id, user_id]
        )

        return result.rows[0] || null
    },

    getProyectCount: async (project_id: number) => {
        /**
         * Obtiene el número de likes de un proyecto
         * 
         * @param {number} project_id - ID del proyecto.
         * @returns {number} Número de likes.
         */
        const result = await db.query(
            `
            SELECT
                count(*) AS total
            FROM ${env.DB_TABLE_PROJECT_LIKES}
            WHERE project_id = $1
            `,
            [project_id]
        )

        return result.rows[0].total
    },

    addLike: async (project_id: number, user_id: number) => {
        /**
         * Agrega un "like" para un proyecto dado por un usuario.
         * 
         * @param {number} project_id - ID del proyecto.
         * @param {number} user_id - ID del usuario.
         * @returns {Object} El "like" recién insertado.
         */
        const result = await db.query(
        `
            INSERT INTO ${env.DB_TABLE_PROJECT_LIKES} (project_id, user_id)
            VALUES ($1, $2)
            RETURNING *
        `,
        [project_id, user_id]
        )

        return result.rows[0]
    },

    removeLike: async (project_id: number, user_id: number) => {
        /**
         * Elimina un "like" de un proyecto dado por un usuario.
         * 
         * @param {number} project_id - ID del proyecto.
         * @param {number} user_id - ID del usuario.
         * @returns {number} Cantidad de filas afectadas (1 si se eliminó correctamente).
         */
        const result = await db.query(
        `
            DELETE FROM ${env.DB_TABLE_PROJECT_LIKES}
            WHERE project_id = $1 AND user_id = $2
            RETURNING *
        `,
        [project_id, user_id]
        )

        return result.rowCount 
    },

    deleteAllByProject: async (project_id: number) => {
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_PROJECT_LIKES} WHERE project_id = $1`,
            [project_id]
        )

        return result.rowCount 
    },
}
