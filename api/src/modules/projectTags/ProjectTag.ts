import { env } from '@/config/config_env'
import { IProjectTag } from './projectTag.interface'
import db from '@/database/connection'

export const projectTagModel = {
    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene todas las etiquetas de un proyecto
         * 
         * Pasos:
         * 1. Ejecuta una consulta SQL que selecciona todas las filas de la tabla de etiquetas de proyectos (`DB_TABLE_PROJECT_CATEGORIES`),
         *    donde el `project_id` coincide con el proporcionado.
         * 2. Devuelve las etiquetas (en forma de filas) asociados a ese `project_id` desde la base de datos.
         * 
         * @param {number} project_id - ID del proyecto.
         * 
         * @returns {Promise<IProjectCategory[]>} - Lista de las etiquetas del proyecto.
         */
        const result = await db.query(
            `SELECT * FROM ${env.DB_TABLE_PROJECT_TAGS} WHERE project_id = $1`,
            [project_id]
        )
        
        return result.rows
    },

    create: async (project_id: number, data: IProjectTag) => {
        /**
         * Crea una nueva relación entre un proyecto y una etiqueta.
         * 
         * Pasos:
         * 1. Se inserta una nueva fila en la tabla `project_tags` para asociar un proyecto con una etiqueta.
         * 2. El `project_id` (ID del proyecto) y `tag_id` (ID de la etiqueta) se utilizan para crear esta relación.
         * 3. Se devuelve la fila recién creada que contiene la relación entre el proyecto y la etiqueta.
         * 
         * @param {number} project_id - ID del proyecto al que se va a asociar la etiqueta.
         * @param {IProjectTag} data - Objeto que contiene el `tag_id` (ID de la etiqueta) a asociar con el proyecto.
         * 
         * @returns {Promise<IProjectTag>} - La relación creada entre el proyecto y la etiqueta.
         */
        const result = await db.query(
            `
            INSERT INTO ${env.DB_TABLE_PROJECT_TAGS} 
                (project_id, tag_id)
            VALUES 
                ($1, $2)
            RETURNING *
            `,
            [project_id, data.tag_id]
        )

        return result.rows[0]
    },

    deleteAllByProject: async (project_id: number) => {
        /**
         * Elimina todas las relaciones de etiquetas asociadas a un proyecto específico.
         * 
         * Pasos:
         * 1. Se ejecuta una consulta SQL `DELETE FROM` para eliminar todas las filas de la tabla `project_tags` que estén asociadas al `project_id` proporcionado.
         * 2. La consulta elimina todas las relaciones de etiquetas a ese proyecto, limpiando cualquier vínculo de etiquetas con el proyecto.
         * 3. Se retorna el número de filas eliminadas (el número de relaciones de etiquetas eliminadas).
         * 
         * @param {number} project_id - ID del proyecto cuyas relaciones con las etiquetas se van a eliminar.
         * 
         * @returns {Promise<number>} - El número de relaciones eliminadas (número de filas afectadas).
         */
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_PROJECT_TAGS} WHERE project_id = $1`,
            [project_id]
          )
          
        return result.rowCount
    }
}