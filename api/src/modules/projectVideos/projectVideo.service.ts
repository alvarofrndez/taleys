import CustomError from '@/modules/customerror/CustomError'
import { IProjectVideo } from './projectVideo.interface'
import { projectVideoModel } from './ProjectVideo'
import { env } from '@/config/config_env'

export const projectVideoService = {
    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene todos los videos de un proyecto
         * 
         * Pasos:
         * 1. Llama a `projectVideoModel.getAllByProject()` con el `project_id` para obtener todos los videos
         * del proyecto.
         * 2. Devuelve una lista de los videos del proyecto.
         * 
         * @param {number} project_id - ID del proyecto que se quiere consultar.
         * 
         * @returns {Promise<IProjectVideo[]>} - Lista de los videos del proyecto.
         */
        return await projectVideoModel.getAllByProject(project_id)
    },

    create: async ( project_id: number, project_video_data: any) => {
        /**
         * Crea una nueva relación entre un proyecto y un video, asociando un video a un proyecto mediante su URL.
         * 
         * Pasos:
         * 1. El método recibe los datos de un video, específicamente su URL, y prepara los datos a ser insertados.
         * 2. Se valida la URL del video utilizando un método de validación (ver método `checkCreateData`).
         * 3. Si la validación es exitosa, se inserta la relación entre el proyecto y el video en la base de datos.
         * 4. Si ocurre un error durante la validación, se lanza un error personalizado.
         * 
         * @param {number} project_id - El ID del proyecto al que se le asociará el video.
         * @param {any} project_video_data - La URL del video a asociar con el proyecto.
         * 
         * @returns {Promise<IProjectVideo>} - Devuelve el objeto de relación entre el proyecto y el video creado.
         */
        const data_to_created: IProjectVideo = {
            url: project_video_data
        }

        const error_message = projectVideoService.checkCreateData(data_to_created)
        if(typeof error_message == 'string') throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)
            
        return await projectVideoModel.create(project_id, data_to_created)
    },

    checkCreateData: (data: any) => {
        /**
         * Valida si los datos proporcionados para la creación de una relación entre un proyecto y un video son correctos.
         * En este caso, valida que la URL del video sea válida.
         * 
         * Pasos:
         * 1. Se valida la URL proporcionada para asegurarse de que sigue un formato de URL adecuado.
         * 2. Si la URL no es válida, se retorna un mensaje de error explicando que la URL no es válida.
         * 3. Si la URL es válida, retorna `true`, indicando que los datos son correctos.
         * 
         * @param {any} data - El objeto de datos del video que incluye la URL del video.
         * 
         * @returns {boolean|string} - Retorna `true` si la URL es válida, o un mensaje de error si no lo es.
         */
        const url_pattern = /^(https?:\/\/)?([\w\d-]+\.)+[\w-]{2,}(\/.*)?$/
        if (!url_pattern.test(data.url)) {
            return `El enlace proporcionado (${data.url}) no es válido`
        }

        return true
    },

    deleteAllByProject: async (project_id: number) => {
        /**
         * Elimina todas las relaciones entre un proyecto y los videos asociados a él.
         * 
         * Pasos:
         * 1. Llama al método `projectVideoModel.deleteAllByProject` para eliminar todas las filas en la tabla `project_videos`
         *    asociadas al `project_id` proporcionado.
         * 2. Retorna el número de filas eliminadas.
         * 
         * @param {number} project_id - ID del proyecto cuyas relaciones de video se van a eliminar.
         * 
         * @returns {Promise<number>} - El número de relaciones eliminadas.
         */
        return await projectVideoModel.deleteAllByProject(project_id)
    }
}