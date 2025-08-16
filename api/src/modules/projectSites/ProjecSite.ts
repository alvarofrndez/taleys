import { IProjectSite } from './projectSite.interface'
import db from '@/database/connection'
import { env } from '@/config/config_env'

export const projectSiteModel = {
    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene todas los sitios de un proyecto
         * 
         * Pasos:
         * 1. Ejecuta una consulta SQL que selecciona todas las filas de la tabla de sitios de proyectos (`DB_TABLE_PROJECT_CATEGORIES`),
         *    donde el `project_id` coincide con el proporcionado.
         * 2. Devuelve los sitios (en forma de filas) asociados a ese `project_id` desde la base de datos.
         * 
         * @param {number} project_id - ID del proyecto.
         * 
         * @returns {Promise<IProjectSite[]>} - Lista de los sitios del proyecto.
         */
        const result = await db.query(
            `SELECT * FROM ${env.DB_TABLE_PROJECT_SITES} WHERE project_id = $1`,
            [project_id]
        )
        
        return result.rows
    },

    create: async (project_id: number, data: IProjectSite) => {
        /**
         * Crea una nueva relación entre un proyecto y un sitio web, asociando un proyecto con un sitio
         * mediante una URL y el proveedor del sitio web.
         * 
         * Pasos:
         * 1. Ejecuta una consulta SQL para insertar una nueva relación en la tabla `project_sites` 
         *    utilizando el `project_id`, la `url` del sitio y el `provider_id`.
         * 2. La consulta usa la sentencia `RETURNING *` para obtener la fila recién creada en la base de datos.
         * 3. Si la inserción es exitosa, retorna la relación creada.
         * 
         * @param {number} project_id - ID del proyecto al cual se le asociará el sitio web.
         * @param {IProjectSite} data - Los datos del sitio web a asociar, incluyendo la URL y el `provider_id`.
         * 
         * @returns {Promise<IProjectSite>} - La relación creada entre el proyecto y el sitio web.
         */
        const result = await db.query(
            `
            INSERT INTO ${env.DB_TABLE_PROJECT_SITES} 
                (project_id, url, provider_id)
            VALUES 
                ($1, $2, $3)
            RETURNING *
            `,
            [project_id, data.url, data.provider_id]
        )

        return result.rows[0]
    },

    deleteAllByProject: async (project_id: number) => {
        /**
         * Elimina todas las relaciones entre un proyecto y los sitios web asociados.
         * 
         * Pasos:
         * 1. Ejecuta una consulta SQL `DELETE FROM` en la tabla `project_sites` para eliminar todas las filas 
         *    relacionadas con el `project_id` proporcionado.
         * 2. La función retorna el número de filas eliminadas.
         * 
         * @param {number} project_id - ID del proyecto cuyas relaciones de sitios se van a eliminar.
         * 
         * @returns {Promise<number>} - El número de relaciones eliminadas (número de filas afectadas).
         */
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_PROJECT_SITES} WHERE project_id = $1`,
            [project_id]
          )
          
        return result.rowCount
    }
}