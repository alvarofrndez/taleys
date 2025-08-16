import { IProjectVideo } from './projectVideo.interface'
import db from '@/database/connection'
import { env } from '@/config/config_env'

export const projectVideoModel = {
    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene todos los videos de un proyecto
         * 
         * Pasos:
         * 1. Ejecuta una consulta SQL que selecciona todas las filas de la tabla de videos de proyectos (`DB_TABLE_PROJECT_VIDEOS`),
         *    donde el `project_id` coincide con el proporcionado.
         * 2. Devuelve los videos (en forma de filas) asociados a ese `project_id` desde la base de datos.
         * 
         * @param {number} project_id - ID del proyecto.
         * 
         * @returns {Promise<IProjectVideo[]>} - Lista de los videos del proyecto.
         */
        const result = await db.query(
            `SELECT * FROM ${env.DB_TABLE_PROJECT_VIDEOS} WHERE project_id = $1`,
            [project_id]
        )
        
        return result.rows
    },

    create: async ( project_id: number, data: IProjectVideo) => {
        /**
         * Crea una nueva relación entre un proyecto y un video, asociando un video con un proyecto mediante su URL.
         * 
         * Pasos:
         * 1. Recibe un `project_id` y una URL de video (`data.url`) como parámetros.
         * 2. Inserta la relación entre el proyecto y el video en la tabla `project_videos`.
         * 3. Retorna el objeto insertado con la relación creada.
         * 
         * @param {number} project_id - El ID del proyecto al que se le asociará el video.
         * @param {IProjectVideo} data - Un objeto que contiene la URL del video que se asociará al proyecto.
         * 
         * @returns {Promise<IProjectVideo>} - Devuelve la relación creada entre el proyecto y el video.
         */
        const result = await db.query(
            `
            INSERT INTO ${env.DB_TABLE_PROJECT_VIDEOS} 
                (project_id, url)
            VALUES 
                ($1, $2)
            RETURNING *
            `,
            [project_id, data.url]
        )

        return result.rows[0]
    },

    deleteAllByProject: async (project_id: number) => {
        /**
         * Elimina todas las relaciones entre un proyecto y los videos asociados a él.
         * 
         * Pasos:
         * 1. Recibe el `project_id` del proyecto cuyos videos deben eliminarse.
         * 2. Realiza una consulta SQL para eliminar todas las relaciones en la tabla `project_videos` que correspondan al `project_id`.
         * 3. Retorna el número de filas eliminadas.
         * 
         * @param {number} project_id - El ID del proyecto cuyas relaciones de videos se eliminarán.
         * 
         * @returns {Promise<number>} - Devuelve el número de relaciones eliminadas (filas afectadas).
         */
        const result = await db.query(
            `DELETE FROM ${env.DB_TABLE_PROJECT_VIDEOS} WHERE project_id = $1`,
            [project_id]
          )
          
        return result.rowCount
    }
}