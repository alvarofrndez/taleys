import { env } from '@/config/config_env'
import db from '@/database/connection'

export const projectModel = {
    getById: async (project_id: number) => {
        /**
         * Obtiene un proyecto a través de su ID.
         *
         * Realiza una consulta SQL en la tabla de proyectos utilizando el ID proporcionado.
         * Si el proyecto existe, devuelve el primer resultado.
         *
         * @param {number} project_id - ID del proyecto a buscar.
         * 
         * @returns {Object|null} El proyecto encontrado o `null` si no existe.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_PROJECTS}
                WHERE id = $1
            `,
            [project_id]
        )

        return result.rows[0]
    },

    getByName: async (name: string) => {
        /**
         * Obtiene un proyecto a través de su name.
         *
         * Realiza una consulta SQL en la tabla de proyectos utilizando el name proporcionado.
         * Si el proyecto existe, devuelve el primer resultado.
         *
         * @param {string} name - ID del proyecto a buscar.
         * 
         * @returns {Object|null} El proyecto encontrado o `null` si no existe.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_PROJECTS}
                WHERE name = $1
            `,
            [name]
        )

        return result.rows[0]
    },

    getAllByUser: async (user_id: number) => {
        /**
         * Obtiene todos los proyectos de un usuario a través de su ID.
         *
         * Realiza una consulta SQL en la tabla de proyectos utilizando el ID proporcionado.
         * Devuelve todo el resultado.
         *
         * @param {number} user_id - ID del usaurio.
         * 
         * @returns {Array|null} El array con los proyectos encontrados o `null` si da error.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_PROJECTS}
                WHERE created_by = $1
            `,
            [user_id]
        )
        
        return result.rows
    },

    getAllByName: async (name: string) => {
        /**
         * Obtiene todos los proyectos a través de su name.
         *
         * Realiza una consulta SQL en la tabla de proyectos utilizando el name proporcionado.
         * Devuelve todo el resultado.
         *
         * @param {string} name - name del proyecto.
         * 
         * @returns {Array|null} El array con los proyectos encontrados o `null` si da error.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_PROJECTS}
                WHERE LOWER(name) = $1
            `,
            [name]
        )
        
        return result.rows
    },

    create: async (user_id: number, data: any) => {
        /**
         * Crea un nuevo proyecto en la base de datos.
         * 
         * Este método inserta un nuevo proyecto con los datos proporcionados por el usuario.
         * Asocia el proyecto con el `user_id` del creador.
         * 
         * Campos obligatorios:
         * - name: nombre del proyecto
         * - description: descripción del proyecto
         * - visibility: 'public' o 'private'
         * - permit_comments: true o false
         * - atribution: true o false
         * 
         * @param {number} user_id - ID del usuario que crea el proyecto.
         * @param {Object} data - Datos del proyecto.
         * @param {string} data.name - Nombre del proyecto.
         * @param {string} data.description - Descripción del proyecto.
         * @param {string} data.visibility - Visibilidad del proyecto ('public' o 'private').
         * 
         * @returns {Object} - El proyecto recién creado.
         */

        const result = await db.query(
            `
            INSERT INTO ${env.DB_TABLE_PROJECTS} 
                (created_by, name, description, visibility)
            VALUES 
                ($1, $2, $3, $4)
            RETURNING *
            `,
            [user_id, data.name, data.description, data.visibility]
        )

        return result.rows[0]
    },

    update: async (id: number, user_id: number, data: any) => {
        /**
         * Crea un nuevo proyecto en la base de datos.
         * 
         * Este método inserta un nuevo proyecto con los datos proporcionados por el usuario.
         * Asocia el proyecto con el `user_id` del creador.
         * 
         * Campos obligatorios:
         * - name: nombre del proyecto
         * - description: descripción del proyecto
         * - visibility: 'public' o 'private'
         * - permit_comments: true o false
         * - atribution: true o false
         * 
         * @param {number} user_id - ID del usuario que crea el proyecto.
         * @param {Object} data - Datos del proyecto.
         * @param {string} data.name - Nombre del proyecto.
         * @param {string} data.description - Descripción del proyecto.
         * @param {string} data.visibility - Visibilidad del proyecto ('public' o 'private').
         * @param {boolean} data.permit_comments - Permitir comentarios en el proyecto.
         * @param {boolean} data.atribution - Requerir atribucion en menciones.
         * 
         * @returns {Object} - El proyecto recién creado.
         */

        const result = await db.query(
            `
            UPDATE ${env.DB_TABLE_PROJECTS} 
            SET
                created_by = $1, name = $2, description = $3, visibility = $4
            WHERE id = $5
            `,
            [user_id, data.name, data.description, data.visibility, id]
        )

        return result.rowCount
    },

    delete: async (project_id: number) => {
        /**
         * Elimina un proyecto de la base de datos a partir de su ID.
         * 
         * Pasos:
         * 1. Ejecuta una consulta SQL para eliminar el proyecto desde la tabla correspondiente.
         * 2. Devuelve el número de filas afectadas (1 si se eliminó correctamente, 0 si no existía).
         * 
         * 
         * @param {number} project_id - ID del proyecto a eliminar.
         * 
         * @returns {number} - Cantidad de filas afectadas por la eliminación (generalmente 1).
         */
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_PROJECTS} WHERE id = $1`,
            [project_id]
          )
          
        return result.rowCount
    }
} 