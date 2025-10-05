import { env } from '@/config/config_env'
import db from '@/database/connection'
import { ISaga } from './saga.interface'

export const sagaModel = {
    getById: async (saga_id: number) => {
        /**
         * Obtiene una saga a través de su ID.
         *
         * Realiza una consulta SQL en la tabla de sagas utilizando el ID proporcionado.
         * Si el saga existe, devuelve el primer resultado.
         *
         * @param {number} saga_id - ID del saga a buscar.
         * 
         * @returns {Object|null} El saga encontrado o `null` si no existe.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_SAGAS}
                WHERE id = $1
            `,
            [saga_id]
        )

        return result.rows[0]
    },

    getByProjectAndName: async (project_id: number, name: string) => {
        /**
         * Obtiene una saga de un proyecto a través de su name.
         *
         * Realiza una consulta SQL en la tabla de sagas utilizando el name proporcionado.
         * Si el saga existe, devuelve el primer resultado.
         *
         * @param {number} project_id - ID del proyecto al que pertenece el saga.
         * 
         * @param {string} name - nombre del saga a buscar.
         * 
         * @returns {Object|null} El saga encontrado o `null` si no existe.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_SAGAS}
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

    getByProjectAndSlug: async (project_id: number, slug: string) => {
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_SAGAS}
                WHERE project_id = $1 AND slug = $2
            `,
            [project_id, slug]
        )

        return result.rows[0]
    },

    getByUniverseAndName: async (universe_id: number, name: string) => {
        /**
         * Obtiene una saga de un universe a través de su name.
         *
         * Realiza una consulta SQL en la tabla de sagas utilizando el name proporcionado.
         * Si el saga existe, devuelve el primer resultado.
         *
         * @param {number} universe_id - ID del universe al que pertenece el saga.
         * 
         * @param {string} name - nombre del saga a buscar.
         * 
         * @returns {Object|null} El saga encontrado o `null` si no existe.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_SAGAS}
                WHERE universe_id = $1 AND name = $2
            `,
            [universe_id, name]
        )

        return result.rows[0]
    },

    getByUniverseAndSlug: async (universe_id: number, slug: string) => {
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_SAGAS}
                WHERE universe_id = $1 AND slug = $2
            `,
            [universe_id, slug]
        )

        return result.rows[0]
    },

    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene todos los sagas a través de su project_id.
         *
         * Realiza una consulta SQL en la tabla de sagas utilizando el project_id proporcionado.
         * Devuelve todo el resultado.
         *
         * @param {number} project_id - project_id del saga.
         * 
         * @returns {Array|null} El array con los sagas encontrados o `null` si da error.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_SAGAS}
                WHERE project_id = $1
            `,
            [project_id]
        )
        
        return result.rows
    },

    getAllByProjectAndNullParentSaga: async (project_id: number) => {
        /**
         * Obtiene todas los sagas a través de su project_id, donde parent_saga_id sea null.
         *
         * Realiza una consulta SQL en la tabla de sagas utilizando el project_id proporcionado.
         * Devuelve todo el resultado.
         *
         * @param {number} project_id - project_id del saga.
         * 
         * @returns {Array|null} El array con los sagas encontrados o `null` si da error.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_SAGAS}
                WHERE project_id = $1
                AND parent_saga_id IS NULL
            `,
            [project_id]
        )
        
        return result.rows
    },

    getAllByUniverse: async (universe_id: number) => {
        /**
         * Obtiene todos los sagas a través de su universe_id.
         *
         * Realiza una consulta SQL en la tabla de sagas utilizando el universe_id proporcionado.
         * Devuelve todo el resultado.
         *
         * @param {number} universe_id - universe_id del saga.
         * 
         * @returns {Array|null} El array con los sagas encontrados o `null` si da error.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_SAGAS}
                WHERE universe_id = $1
            `,
            [universe_id]
        )
        
        return result.rows
    },

    getAllSagasChilds: async (saga_id: number) => {
        /**
         * Obtiene todas als sagas hiajs de una saga a través de su ID.
         *
         * Realiza una consulta SQL en la tabla de sagas utilizando el ID proporcionado.
         * Devuelve un array con todas als sagas hiajs.
         *
         * @param {number} saga_id - ID del saga a buscar.
         * 
         * @returns {ISaga[]|[]} El saga encontrado o `null` si no existe.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_SAGAS}
                WHERE parent_saga_id = $1
            `,
            [saga_id]
        )

        return result.rows
    },


    create: async (project_id: number, data: any) => {
        /**
         * Crea un nuevo saga en la base de datos.
         * 
         * Este método inserta un nuevo saga con los datos proporcionados.
         * Asocia el saga con el `project_id` del proyecto.
         * 
         * Campos obligatorios:
         * - name: nombre del saga
         * - description: descripción del saga
         * - project_id: Id del proyecto
         * 
         * @param {number} project_id - ID del proyecto al que pertenece.
         * @param {number} universe_id - ID del universo al que pertenece.
         * @param {Object} data - Datos del saga.
         * @param {string} data.name - Nombre del saga.
         * @param {string} data.description - Descripción del saga.
         * @param {string} data.parent_saga_id - Id del saga padre, en caso de que tenga.
         * 
         * @returns {Object} - El saga recién creado.
         */

        const result = await db.query(
            `
            INSERT INTO ${env.DB_TABLE_SAGAS} 
                (project_id, universe_id, name, slug, description, parent_saga_id)
            VALUES 
                ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [project_id, data.universe_id ?? null, data.name, data.slug, data.description, data.parent_saga_id ?? null]
        )

        return result.rows[0]
    },

    update: async (id: number, data: any) => {
        /**
         * Actualiza un nuevo saga en la base de datos.
         * 
         * Este método actualiza un nuevo saga con los datos proporcionados por el usuario.
         * 
         * Campos obligatorios:
         * - name: nombre del saga
         * - description: descripción del saga
         * - project_id: Id del proyecto
         * 
         * @param {Object} data - Datos del saga.
         * @param {number} data.universe_id - Id del universo al que pertenece.
         * @param {string} data.name - Nombre del saga.
         * @param {string} data.description - Descripción del saga.
         * @param {string} data.parent_saga_id - Id del saga padre, en caso de que tenga.
         * 
         * @returns {Object} - El saga recién creado.
         */

        const result = await db.query(
            `
            UPDATE ${env.DB_TABLE_SAGAS} 
            SET
                universe_id =$1, name = $2, slug = $3, description = $4, parent_saga_id = $5, updated_at = now()
            WHERE id = $6
            `,
            [data.universe_id, data.name, data.slug, data.description, data.parent_saga_id, id]
        )

        return result.rowCount
    },

    delete: async (saga_id: number) => {
        /**
         * Elimina una saga de la base de datos a partir de su ID.
         * 
         * @param {number} saga_id - ID del saga a eliminar.
         * 
         * @returns {number} - Cantidad de filas afectadas por la eliminación (generalmente 1).
         */
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_SAGAS} WHERE id = $1`,
            [saga_id]
          )
          
        return result.rowCount
    },

    deleteAllByUniverse: async (universe_id: number) => {
        /**
         * Elimina todas las sagas pertenecientes a un universo.
         * 
         * @param {number} universe_id - ID del saga a eliminar.
         * 
         * @returns {number} - Cantidad de filas afectadas por la eliminación (generalmente 1).
         */
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_SAGAS} WHERE universe_id = $1`,
            [universe_id]
          )
          
        return result.rowCount
    },
} 