import { env } from '@/config/config_env'
import db from '@/database/connection'
import { IBook } from './book.interface'

export const bookModel = {
    getById: async (book_id: number) => {
        /**
         * Obtiene un libro a través de su ID.
         *
         * Realiza una consulta SQL en la tabla de libros utilizando el ID proporcionado.
         * Si el libro existe, devuelve el primer resultado.
         *
         * @param {number} book_id - ID del libro a buscar.
         * 
         * @returns {Object|null} El libro encontrado o `null` si no existe.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_BOOKS}
                WHERE id = $1
            `,
            [book_id]
        )

        return result.rows[0]
    },

    getByProjectAndTitle: async (project_id: number, title: string) => {
        /**
         * Obtiene un libro de un proyecto a través de su title.
         *
         * Realiza una consulta SQL en la tabla de libros utilizando el title proporcionado.
         * Si el libro existe, devuelve el primer resultado.
         *
         * @param {number} project_id - ID del proyecto al que pertenece el libro.
         * 
         * @param {string} title - título del libro a buscar.
         * 
         * @returns {Object|null} El libro encontrado o `null` si no existe.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_BOOKS}
                WHERE project_id = $1 AND title = $2
            `,
            [project_id, title]
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
                FROM ${env.DB_TABLE_BOOKS}
                WHERE project_id = $1 AND slug = $2
            `,
            [project_id, slug]
        )

        return result.rows[0]
    },

    getByUniverseAndTitle: async (universe_id: number, title: string) => {
        /**
         * Obtiene un libro de un universe a través de su title.
         *
         * Realiza una consulta SQL en la tabla de libros utilizando el title proporcionado.
         * Si el libro existe, devuelve el primer resultado.
         *
         * @param {number} universe_id - ID del universe al que pertenece el libro.
         * 
         * @param {string} title - título del libro a buscar.
         * 
         * @returns {Object|null} El libro encontrado o `null` si no existe.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_BOOKS}
                WHERE universe_id = $1 AND title = $2
            `,
            [universe_id, title]
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
                FROM ${env.DB_TABLE_BOOKS}
                WHERE universe_id = $1 AND slug = $2
            `,
            [universe_id, slug]
        )

        return result.rows[0]
    },

    getBySagaAndTitle: async (saga_id: number, title: string) => {
        /**
         * Obtiene un libro de una saga a través de su title.
         *
         * Realiza una consulta SQL en la tabla de libros utilizando el title proporcionado.
         * Si el libro existe, devuelve el primer resultado.
         *
         * @param {number} saga_id - ID de la saga al que pertenece el libro.
         * 
         * @param {string} title - título del libro a buscar.
         * 
         * @returns {Object|null} El libro encontrado o `null` si no existe.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_BOOKS}
                WHERE saga_id = $1 AND title = $2
            `,
            [saga_id, title]
        )

        return result.rows[0]
    },

    getBySagaAndSlug: async (saga_id: number, slug: string) => {
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_BOOKS}
                WHERE saga_id = $1 AND slug = $2
            `,
            [saga_id, slug]
        )

        return result.rows[0]
    },

    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene todos los libros a través de su project_id.
         *
         * Realiza una consulta SQL en la tabla de libros utilizando el project_id proporcionado.
         * Devuelve todo el resultado.
         *
         * @param {number} project_id - project_id del libro.
         * 
         * @returns {Array|null} El array con los libros encontrados o `null` si da error.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_BOOKS}
                WHERE project_id = $1
            `,
            [project_id]
        )
        
        return result.rows
    },

    getAllByUniverse: async (universe_id: number) => {
        /**
         * Obtiene todos los libros a través de su universe_id.
         *
         * Realiza una consulta SQL en la tabla de libros utilizando el universe_id proporcionado.
         * Devuelve todo el resultado.
         *
         * @param {number} universe_id - universe_id del libro.
         * 
         * @returns {Array|null} El array con los libros encontrados o `null` si da error.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_BOOKS}
                WHERE universe_id = $1
            `,
            [universe_id]
        )
        
        return result.rows
    },

    getAllBySaga: async (saga_id: number) => {
        /**
         * Obtiene todos los libros a través de su saga_id.
         *
         * Realiza una consulta SQL en la tabla de libros utilizando el saga_id proporcionado.
         * Devuelve todo el resultado.
         *
         * @param {number} saga_id - saga_id del libro.
         * 
         * @returns {Array|null} El array con los libros encontrados o `null` si da error.
         */
        const result = await db.query(
            `
                SELECT 
                *, 
                TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at,
                TO_CHAR(updated_at, 'DD TMMonth, YYYY') AS updated_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS updated_at_formatted
                FROM ${env.DB_TABLE_BOOKS}
                WHERE saga_id = $1
            `,
            [saga_id]
        )
        
        return result.rows
    },

    create: async (project_id: number, data: any) => {
        /**
         * Crea un nuevo book en la base de datos.
         * 
         * Este método inserta un nuevo book con los datos proporcionados.
         * Asocia el libro con el `project_id` del proyecto.
         * 
         * Campos obligatorios:
         * - title: nombre del libro
         * - synopsis: sinopsis del libro
         * - project_id: Id del proyecto
         * 
         * @param {number} project_id - ID del proyecto al que pertenece.
         * @param {number} universe_id - ID del universo al que pertenece.
         * @param {number} saga_id - ID de la saga al que pertenece.
         * @param {Object} data - Datos del libro.
         * @param {string} data.title - Nombre del libro.
         * @param {string} data.synopsis - Sinopsis del libro.
         * 
         * @returns {Object} - El libro recién creado.
         */

        const result = await db.query(
            `
            INSERT INTO ${env.DB_TABLE_BOOKS} 
                (project_id, universe_id, saga_id, title, slug, synopsis)
            VALUES 
                ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [project_id, data.universe_id ?? null, data.saga_id ?? null, data.title, data.slug, data.synopsis]
        )

        return result.rows[0]
    },

    update: async (id: number, data: any) => {
        /**
         * Actualiza un nuevo book en la base de datos.
         * 
         * Este método actualiza un nuevo book con los datos proporcionados por el usuario.
         * 
         * Campos obligatorios:
         * - title: nombre del libro
         * - synopsis: sinopsis del libro
         * - project_id: Id del proyecto
         * 
         * @param {Object} data - Datos del libro.
         * @param {number} data.universe_id - Id del universo al que pertenece.
         * @param {number} data.saga_id - Id de la saga al que pertenece.
         * @param {string} data.title - Nombre del libro.
         * @param {string} data.synopsis - Sinopsis del libro.
         * 
         * @returns {Object} - El libro recién creado.
         */

        const result = await db.query(
            `
            UPDATE ${env.DB_TABLE_BOOKS} 
            SET
                universe_id =$1, saga_id = $2, title = $3, slug = $4, synopsis = $5, updated_at = now()
            WHERE id = $6
            `,
            [data.universe_id, data.saga_id, data.title, data.slug, data.synopsis, id]
        )

        return result.rowCount
    },

    delete: async (book_id: number) => {
        /**
         * Elimina un libro de la base de datos a partir de su ID.
         * 
         * @param {number} book_id - ID del libro a eliminar.
         * 
         * @returns {number} - Cantidad de filas afectadas por la eliminación (generalmente 1).
         */
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_BOOKS} WHERE id = $1`,
            [book_id]
          )
          
        return result.rowCount
    },

    deleteAllByUniverse: async (universe_id: number) => {
        /**
         * Elimina todas las libros pertenecientes a un universo.
         * 
         * @param {number} universe_id - ID del universo a eliminar.
         * 
         * @returns {number} - Cantidad de filas afectadas por la eliminación.
         */
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_BOOKS} WHERE universe_id = $1`,
            [universe_id]
          )
          
        return result.rowCount
    },

    deleteAllBySaga: async (universe_id: number) => {
        /**
         * Elimina todas las libros pertenecientes a una saga.
         * 
         * @param {number} universe_id - ID de la saga a eliminar.
         * 
         * @returns {number} - Cantidad de filas afectadas por la eliminación.
         */
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_BOOKS} WHERE universe_id = $1`,
            [universe_id]
          )
          
        return result.rowCount
    },
} 