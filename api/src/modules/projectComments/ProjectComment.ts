import { env } from '@/config/config_env'
import db from '@/database/connection'

export const projectCommentModel = {
    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene todos los comentarios de un proyecto por su ID.
         * Incluye cantidad de likes para cada comentario.
         * 
         * @param {number} project_id - ID del proyecto.
         * @returns {Array} Lista de comentarios.
         */
        const result = await db.query(
            `
            SELECT 
                pc.*, 
                TO_CHAR(pc.created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(pc.updated_at, 'DD TMMonth, YYYY') AS updated_at,
                (
                    SELECT COUNT(*) FROM ${env.DB_TABLE_PROJECT_COMMENT_LIKES}
                    WHERE comment_id = pc.id
                ) AS like_count
            FROM ${env.DB_TABLE_PROJECT_COMMENTS} pc
            WHERE pc.project_id = $1
            ORDER BY pc.created_at ASC
            `,
            [project_id]
        )

        return result.rows
    },

    getById: async (comment_id: number) => {
        /**
         * Obtiene un comentario por su ID.
         * 
         * @param {number} comment_id - ID del comentario.
         * @returns {Object|null} Comentario encontrado o null.
         */
        const result = await db.query(
            `
            SELECT
                *,
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at
            FROM ${env.DB_TABLE_PROJECT_COMMENTS}
            WHERE id = $1
            `,
            [comment_id]
        )

        return result.rows[0] || null
    },

    getProyectCount: async (project_id: number) => {
        /**
         * Obtiene el número de comentarios de un proyecto
         * 
         * @param {number} project_id - ID del proyecto.
         * @returns {number} Número de comentarios.
         */
        const result = await db.query(
            `
            SELECT
                count(*) AS total
            FROM ${env.DB_TABLE_PROJECT_COMMENTS}
            WHERE project_id = $1
            `,
            [project_id]
        )

        return result.rows[0].total
    },

    create: async (data: any) => {
        /**
         * Crea un nuevo comentario en un proyecto.
         * 
         * @param {number} project_id - ID del proyecto.
         * @param {number} user_id - ID del usuario.
         * @param {string} content - Contenido del comentario.
         * @returns {Object} Comentario recién creado.
         */
        const result = await db.query(
            `
            INSERT INTO ${env.DB_TABLE_PROJECT_COMMENTS} 
                (project_id, created_by, content)
            VALUES 
                ($1, $2, $3)
            RETURNING *
            `,
            [data.project_id, data.created_by, data.content]
        )

        return result.rows[0]
    },

    delete: async (comment_id: number) => {
        /**
         * Elimina un comentario por su ID.
         * 
         * @param {number} comment_id - ID del comentario.
         * @returns {boolean} true si fue eliminado.
         */
        const result = await db.query(
            `
            DELETE FROM ${env.DB_TABLE_PROJECT_COMMENTS}
            WHERE id = $1
            `,
            [comment_id]
        )

        return result.rowCount > 0
    },

    deleteAllByProject: async (comment_id: number) => {
        /**
         * Elimina un comentario por su ID.
         * 
         * @param {number} comment_id - ID del comentario.
         * @returns {boolean} true si fue eliminado.
         */
        const result = await db.query(
            `
            DELETE FROM ${env.DB_TABLE_PROJECT_COMMENTS}
            WHERE id = $1
            `,
            [comment_id]
        )

        return result.rowCount > 0
    },

    hasLiked: async (comment_id: number, user_id: number) => {
        /**
         * Verifica si un usuario ya dio like a un comentario.
         * 
         * @param {number} comment_id - ID del comentario.
         * @param {number} user_id - ID del usuario.
         * @returns {boolean} true si existe el like.
         */
        const result = await db.query(
            `
            SELECT 1 FROM ${env.DB_TABLE_PROJECT_COMMENT_LIKES}
            WHERE comment_id = $1 AND user_id = $2
            `,
            [comment_id, user_id]
        )

        return result.rowCount > 0
    },
}
