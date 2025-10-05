import { env } from '@/config/config_env'
import db from '@/database/connection'
import { IUniverse } from './universe.interface'

export const universeModel = {
    getById: async (universe_id: number) => {
        /**
         * Obtiene un universo a través de su ID.
         *
         * Realiza una consulta SQL en la tabla de universos utilizando el ID proporcionado.
         * Si el universo existe, devuelve el primer resultado.
         *
         * @param {number} universe_id - ID del universo a buscar.
         * 
         * @returns {Object|null} El universo encontrado o `null` si no existe.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_UNIVERSES}
                WHERE id = $1
            `,
            [universe_id]
        )

        return result.rows[0]
    },

    getByName: async (project_id: number, name: string) => {
        /**
         * Obtiene un universo de un proyecto a través de su name.
         *
         * Realiza una consulta SQL en la tabla de universos utilizando el name proporcionado.
         * Si el universo existe, devuelve el primer resultado.
         *
         * @param {number} project_id - ID del proyecto al que pertenece el universo.
         * 
         * @param {string} name - nombre del universo a buscar.
         * 
         * @returns {Object|null} El universo encontrado o `null` si no existe.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_UNIVERSES}
                WHERE project_id = $1 AND name = $2
            `,
            [project_id, name]
        )

        return result.rows[0]
    },

    getBySlug: async (project_id: number, slug: string) => {
        /**
         * Obtiene un universo de un proyecto a través de su slug.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_UNIVERSES}
                WHERE project_id = $1 AND slug = $2
            `,
            [project_id, slug]
        )

        return result.rows[0]
    },

    getAllByName: async (name: string) => {
        /**
         * Obtiene todos los universos a través de su name.
         *
         * Realiza una consulta SQL en la tabla de universos utilizando el name proporcionado.
         * Devuelve todo el resultado.
         *
         * @param {string} name - name del universo.
         * 
         * @returns {Array|null} El array con los universos encontrados o `null` si da error.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_UNIVERSES}
                WHERE LOWER(name) = $1
            `,
            [name]
        )
        
        return result.rows
    },

    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene todos los universos a través de su project_id.
         *
         * Realiza una consulta SQL en la tabla de universos utilizando el project_id proporcionado.
         * Devuelve todo el resultado.
         *
         * @param {number} project_id - project_id del universo.
         * 
         * @returns {Array|null} El array con los universos encontrados o `null` si da error.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_UNIVERSES}
                WHERE project_id = $1
            `,
            [project_id]
        )
        
        return result.rows
    },

    getAllByProjectAndNullParentUniverse: async (project_id: number) => {
        /**
         * Obtiene todos los universos a través de su project_id, donde el parent_universe_id sea null.
         *
         * Realiza una consulta SQL en la tabla de universos utilizando el project_id proporcionado.
         * Devuelve todo el resultado.
         *
         * @param {number} project_id - project_id del universo.
         * 
         * @returns {Array|null} El array con los universos encontrados o `null` si da error.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_UNIVERSES}
                WHERE project_id = $1
                AND parent_universe_id IS NULL
            `,
            [project_id]
        )
        
        return result.rows
    },

    getAllUniverseChilds: async (universe_id: number) => {
        /**
         * Obtiene todos los universos hijos de un universo a través de su ID.
         *
         * Realiza una consulta SQL en la tabla de universos utilizando el ID proporcionado.
         * Devuelve un array con todos los universos hijos.
         *
         * @param {number} universe_id - ID del universo a buscar.
         * 
         * @returns {IUniverse[]|[]} El universo encontrado o `null` si no existe.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_UNIVERSES}
                WHERE parent_universe_id = $1
            `,
            [universe_id]
        )

        return result.rows
    },

    create: async (project_id: number, data: any) => {
        /**
         * Crea un nuevo universo en la base de datos.
         * 
         * Este método inserta un nuevo universo con los datos proporcionados.
         * Asocia el universo con el `project_id` del proyecto.
         * 
         * Campos obligatorios:
         * - name: nombre del universo
         * - description: descripción del universo
         * - project_id: Id del proyecto
         * 
         * @param {number} project_id - ID del proyecto al que pertenece.
         * @param {Object} data - Datos del universo.
         * @param {string} data.name - Nombre del universo.
         * @param {string} data.description - Descripción del universo.
         * @param {string} data.parent_universe_id - Id del universo padre, en caso de que tenga.
         * 
         * @returns {Object} - El universo recién creado.
         */

        const result = await db.query(
            `
            INSERT INTO ${env.DB_TABLE_UNIVERSES} 
                (project_id, name, slug, description, parent_universe_id)
            VALUES 
                ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [project_id, data.name, data.slug, data.description, data.parent_universe_id ?? null]
        )

        return result.rows[0]
    },

    update: async (id: number, data: any) => {
        /**
         * Actualiza un nuevo universo en la base de datos.
         * 
         * Este método actualiza un nuevo universo con los datos proporcionados por el usuario.
         * 
         * Campos obligatorios:
         * - name: nombre del universo
         * - description: descripción del universo
         * - project_id: Id del proyecto
         * 
         * @param {Object} data - Datos del universo.
         * @param {string} data.name - Nombre del universo.
         * @param {string} data.description - Descripción del universo.
         * @param {string} data.parent_universe_id - Id del universo padre, en caso de que tenga.
         * 
         * @returns {Object} - El universo recién creado.
         */

        const result = await db.query(
            `
            UPDATE ${env.DB_TABLE_UNIVERSES} 
            SET
                name = $1, slug = $2, description = $3, parent_universe_id = $4, updated_at = now()
            WHERE id = $5
            `,
            [data.name, data.slug, data.description, data.parent_universe_id, id]
        )

        return result.rowCount
    },

    delete: async (universe_id: number) => {
        /**
         * Elimina un universo de la base de datos a partir de su ID.
         * 
         * Pasos:
         * 1. Ejecuta una consulta SQL para eliminar el universo desde la tabla correspondiente.
         * 2. Devuelve el número de filas afectadas (1 si se eliminó correctamente, 0 si no existía).
         * 
         * 
         * @param {number} universe_id - ID del universo a eliminar.
         * 
         * @returns {number} - Cantidad de filas afectadas por la eliminación (generalmente 1).
         */
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_UNIVERSES} WHERE id = $1`,
            [universe_id]
          )
          
        return result.rowCount
    }
} 