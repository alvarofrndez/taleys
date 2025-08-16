import { IProjectImage } from './projectImage.interface'
import { env } from '@/config/config_env'
import db from '@/database/connection'

export const projectImageModel = {
    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene todas las imágenes asociadas a un proyecto.
         * 
         * Pasos:
         * 1. Realiza una consulta SQL a la base de datos para obtener todas las imágenes de un proyecto específico usando el `project_id`.
         * 2. Retorna todas las filas obtenidas de la consulta.
         * 
         * @param {number} project_id - ID del proyecto para el cual se desean obtener las imágenes.
         * 
         * @returns {Promise<IProjectImage[]>} - Lista de imágenes asociadas al proyecto.
         */
        const result = await db.query(
            `SELECT * FROM ${env.DB_TABLE_PROJECT_IMAGES} WHERE project_id = $1`,
            [project_id]
        )
        
        return result.rows
    },
    
    getById: async (id: number) => {
        /**
         * Obtiene una imagen por su id.
         * 
         * Pasos:
         * 1. Realiza una consulta SQL a la base de datos para obtener la imagen usando `id`.
         * 2. Retorna todas las filas obtenidas de la consulta.
         * 
         * @param {number} id - ID de la imagen.
         * 
         * @returns {Promise<IProjectImage[]>} - Lista de imágenes asociadas al proyecto.
         */
        const result = await db.query(
            `SELECT * FROM ${env.DB_TABLE_PROJECT_IMAGES} WHERE id = $1`,
            [id]
        )
        
        return result.rows[0]
    },
    create: async (project_id: number, data: IProjectImage) => {
        /**
         * Crea una nueva imagen asociada a un proyecto.
         * 
         * Pasos:
         * 1. Realiza una inserción en la base de datos de una nueva imagen para el proyecto.
         * 2. La inserción se hace en la tabla `DB_TABLE_PROJECT_IMAGES`, con los valores del `project_id`, `url`, y `file_name`.
         * 3. La imagen se crea correctamente si la inserción se realiza con éxito.
         * 4. Devuelve la imagen creada (con sus datos).
         * 
         * @param {number} project_id - ID del proyecto al que se desea asociar la imagen.
         * @param {IProjectImage} data - Datos de la imagen, como la URL y el nombre del archivo.
         * 
         * @returns {Promise<IProjectImage>} - La imagen recién creada asociada al proyecto.
         */
        const result = await db.query(
            `
            INSERT INTO ${env.DB_TABLE_PROJECT_IMAGES} 
                (project_id, url, file_name)
            VALUES 
                ($1, $2, $3)
            RETURNING *
            `,
            [project_id, data.url, data.file_name]
        )

        return result.rows[0]
    },

    deleteAllByProject: async (project_id: number) => {
        /**
         * Elimina todas las imágenes asociadas a un proyecto específico.
         * 
         * Pasos:
         * 1. Realiza una consulta SQL para eliminar todas las imágenes asociadas a un proyecto en la tabla `DB_TABLE_PROJECT_IMAGES`.
         * 2. Elimina todas las relaciones de imágenes con el proyecto utilizando el `project_id`.
         * 3. Retorna el número de filas eliminadas, lo que indica cuántas imágenes fueron eliminadas.
         * 
         * @param {number} project_id - ID del proyecto cuyas imágenes se van a eliminar.
         * 
         * @returns {Promise<number>} - El número de imágenes eliminadas.
         */
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_PROJECT_IMAGES} WHERE project_id = $1`,
            [project_id]
          )
          
        return result.rowCount
    },

    delete: async (id: number) => {
        /**
         * Elimina una iamgen asociada a un proyecto.
         * 
         * Pasos:
         * 1. Realiza una consulta SQL para la imagen del proyecto en la tabla `DB_TABLE_PROJECT_IMAGES`.
         * 2. Retorna el número de filas eliminadas, lo que indica que la imagen fue eliminada.
         * 
         * @param {number} id - ID de la imagen.
         * 
         * @returns {Promise<number>} - El número de imágenes eliminadas.
         */
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_PROJECT_IMAGES} WHERE id = $1`,
            [id]
          )
          
        return result.rowCount
    }
}