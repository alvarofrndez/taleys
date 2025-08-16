import { env } from '@/config/config_env'
import db from '@/database/connection'
import { IProjectCommentLike } from './projectCommentLike.interface'

export const projectCommentLikeModel = {
    getByComment: async (comment_id: number) => {
        /**
         * Obtiene los likes de un comentario.
         * 
         * @param {number} comment_id - ID del comentario.
         * @returns {IProjectCommentLike[]} Los likes encontrado o `null` si no existe.
         */
        const result = await db.query(
        `
            SELECT * FROM ${env.DB_TABLE_PROJECT_COMMENT_LIKES}
            WHERE comment_id = $1
        `,
        [comment_id]
        )

        return result.rows
    },

    getByCommentAndUser: async (comment_id: number, user_id: number) => {
        /**
         * Obtiene el "like" de un comentario dado por un usuario.
         * 
         * @param {number} comment_id - ID del comentario.
         * @param {number} user_id - ID del usuario.
         * @returns {Object|null} El like encontrado o `null` si no existe.
         */
        const result = await db.query(
        `
            SELECT * FROM ${env.DB_TABLE_PROJECT_COMMENT_LIKES}
            WHERE comment_id = $1 AND user_id = $2
        `,
        [comment_id, user_id]
        )

        return result.rows[0] || null
    },

    addLike: async (comment_id: number, user_id: number) => {
        /**
         * Agrega un "like" para un comentario dado por un usuario.
         * 
         * @param {number} comment_id - ID del comentario.
         * @param {number} user_id - ID del usuario.
         * @returns {Object} El "like" recién insertado.
         */
        const result = await db.query(
        `
            INSERT INTO ${env.DB_TABLE_PROJECT_COMMENT_LIKES} (comment_id, user_id)
            VALUES ($1, $2)
            RETURNING *
        `,
        [comment_id, user_id]
        )

        return result.rows[0]
    },

    removeLike: async (comment_id: number, user_id: number) => {
        /**
         * Elimina un "like" de un comentario dado por un usuario.
         * 
         * @param {number} comment_id - ID del comentario.
         * @param {number} user_id - ID del usuario.
         * @returns {number} Cantidad de filas afectadas (1 si se eliminó correctamente).
         */
        const result = await db.query(
        `
            DELETE FROM ${env.DB_TABLE_PROJECT_COMMENT_LIKES}
            WHERE comment_id = $1 AND user_id = $2
            RETURNING *
        `,
        [comment_id, user_id]
        )

        return result.rowCount 
    },

    deleteAllByComment: async (comment_id: number) => {
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_PROJECT_COMMENT_LIKES} WHERE comment_id = $1`,
            [comment_id]
        )

        return result.rowCount 
    },
    
    getLikesCount: async (comment_id: number) => {
        /**
         * Verifica si un comentario tiene "likes" y cuántos.
         * 
         * @param {number} comment_id - ID del comentario.
         * @returns {number} Número de "likes" en el comentario.
         */
        const result = await db.query(
        `
            SELECT COUNT(*) AS likes_count FROM ${env.DB_TABLE_PROJECT_COMMENT_LIKES}
            WHERE comment_id = $1
        `,
        [comment_id]
        )

        return parseInt(result.rows[0].likes_count, 10)
    },
}
