import { env } from '@/config/config_env'
import db from '@/database/connection'

export const projectSaveModel = {
    getByProject: async (project_id: number) => {
        /**
         * Obtiene los saves de un proyecto.
         * 
         * @param {number} project_id - ID del proyecto.
         * @returns {IProjectProjectSave[]} Los saves encontrado o `null` si no existe.
         */
        const result = await db.query(
        `
            SELECT * FROM ${env.DB_TABLE_PROJECT_SAVES}
            WHERE project_id = $1
        `,
        [project_id]
        )

        return result.rows
    },

    getByProjectAndUser: async (project_id: number, user_id: number) => {
        /**
         * Obtiene el "save" de un proyecto dado por un usuario.
         * 
         * @param {number} project_id - ID del proyecto.
         * @param {number} user_id - ID del usuario.
         * @returns {Object|null} El save encontrado o `null` si no existe.
         */
        const result = await db.query(
        `
            SELECT * FROM ${env.DB_TABLE_PROJECT_SAVES}
            WHERE project_id = $1 AND user_id = $2
        `,
        [project_id, user_id]
        )

        return result.rows[0] || null
    },

    getProyectCount: async (project_id: number) => {
        /**
         * Obtiene el número de guardados de un proyecto
         * 
         * @param {number} project_id - ID del proyecto.
         * @returns {number} Número de guardados.
         */
        const result = await db.query(
            `
            SELECT
                count(*) AS total
            FROM ${env.DB_TABLE_PROJECT_SAVES}
            WHERE project_id = $1
            `,
            [project_id]
        )

        return result.rows[0].total
    },

    addSave: async (project_id: number, user_id: number) => {
        /**
         * Agrega un "save" para un proyecto dado por un usuario.
         * 
         * @param {number} project_id - ID del proyecto.
         * @param {number} user_id - ID del usuario.
         * @returns {Object} El "save" recién insertado.
         */
        const result = await db.query(
        `
            INSERT INTO ${env.DB_TABLE_PROJECT_SAVES} (project_id, user_id)
            VALUES ($1, $2)
            RETURNING *
        `,
        [project_id, user_id]
        )

        return result.rows[0]
    },

    removeSave: async (project_id: number, user_id: number) => {
        /**
         * Elimina un "save" de un proyecto dado por un usuario.
         * 
         * @param {number} project_id - ID del proyecto.
         * @param {number} user_id - ID del usuario.
         * @returns {number} Cantidad de filas afectadas (1 si se eliminó correctamente).
         */
        const result = await db.query(
        `
            DELETE FROM ${env.DB_TABLE_PROJECT_SAVES}
            WHERE project_id = $1 AND user_id = $2
            RETURNING *
        `,
        [project_id, user_id]
        )

        return result.rowCount 
    },

    deleteAllByProject: async (project_id: number) => {
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_PROJECT_SAVES} WHERE project_id = $1`,
            [project_id]
        )

        return result.rowCount 
    },
    
    getSavesCount: async (project_id: number) => {
        /**
         * Verifica si un proyecto tiene "saves" y cuántos.
         * 
         * @param {number} project_id - ID del proyecto.
         * @returns {number} Número de "saves" en el proyecto.
         */
        const result = await db.query(
        `
            SELECT COUNT(*) AS saves_count FROM ${env.DB_TABLE_PROJECT_SAVES}
            WHERE project_id = $1
        `,
        [project_id]
        )

        return parseInt(result.rows[0].saves_count, 10)
    },
}
