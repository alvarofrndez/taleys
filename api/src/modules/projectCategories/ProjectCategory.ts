import db from '@/database/connection'
import { env } from '@/config/config_env'
import { IProjectCategory } from './projectCategory.interface'

export const projectCategoryModel = {
    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene todas las categorias de un proyecto
         * 
         * Pasos:
         * 1. Ejecuta una consulta SQL que selecciona todas las filas de la tabla de categorias de proyectos (`DB_TABLE_PROJECT_CATEGORIES`),
         *    donde el `project_id` coincide con el proporcionado.
         * 2. Devuelve las categorias (en forma de filas) asociados a ese `project_id` desde la base de datos.
         * 
         * @param {number} project_id - ID del proyecto.
         * 
         * @returns {Promise<IProjectCategory[]>} - Lista de las categorias del proyecto.
         */
        const result = await db.query(
            `SELECT * FROM ${env.DB_TABLE_PROJECT_CATEGORIES} WHERE project_id = $1`,
            [project_id]
        )
        
        return result.rows
    },

    create: async(project_id: number, data: IProjectCategory) => {
        /**
         * Crea una nueva categoría asociada a un proyecto específico.
         * 
         * Pasos:
         * 1. Se ejecuta una consulta SQL `INSERT INTO` que inserta una nueva fila en la tabla de categorías de proyectos (`project_categories`).
         * 2. La consulta toma dos parámetros: el `project_id` (ID del proyecto al que se está asociando la categoría) y el `type_id` (tipo de la categoría que se está asignando).
         * 3. El método usa `RETURNING *` para obtener la fila recién insertada, que incluye los detalles de la categoría que se acaba de crear.
         * 4. Finalmente, se devuelve la primera fila de los resultados (`result.rows[0]`), que contiene la categoría recién creada.
         * 
         * @param {number} project_id - ID del proyecto al que se asociará la categoría.
         * @param {IProjectCategory} data - Datos de la categoría que incluye el `type_id`, el tipo de la categoría.
         * 
         * @returns {Promise<IProjectCategory>} - La categoría recién creada con los datos asociados al proyecto.
         */
        const result = await db.query(
            `
            INSERT INTO ${env.DB_TABLE_PROJECT_CATEGORIES} 
                (project_id, type_id)
            VALUES 
                ($1, $2)
            RETURNING *
            `,
            [project_id, data.type_id]
        )

        return result.rows[0]
    },

    deleteAllByProject: async (project_id: number) => {
        /**
        * Elimina todas las categorías asociadas a un proyecto específico.
        * 
        * Pasos:
        * 1. Se ejecuta una consulta SQL `DELETE FROM` para eliminar todas las filas en la tabla de categorías de proyectos (`project_categories`) que están asociadas al `project_id` dado.
        * 2. La consulta elimina todas las categorías asociadas al proyecto en cuestión.
        * 3. El método retorna el número de filas eliminadas, lo que indica cuántas categorías fueron eliminadas.
        * 
        * @param {number} project_id - ID del proyecto cuyas categorías se van a eliminar.
        * 
        * @returns {Promise<number>} - El número de categorías eliminadas (número de filas afectadas).
        */
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_PROJECT_CATEGORIES} WHERE project_id = $1`,
            [project_id]
        )

        return result.rowCount
    }
} 