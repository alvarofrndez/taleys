import CustomError from '@/modules/customerror/CustomError'
import { projectImageModel } from './ProjectImage'
import { IProjectImage } from './projectImage.interface'
import { env } from '@/config/config_env'
import { s3Service } from '@/services/s3'

export const projectImageService = {
    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene todas las imágenes asociadas a un proyecto.
         * 
         * Pasos:
         * 1. Llama al modelo `projectImageModel` para obtener todas las imágenes asociadas a un proyecto.
         * 2. El parámetro `project_id` se utiliza para filtrar las imágenes asociadas a ese proyecto en particular.
         * 
         * @param {number} project_id - ID del proyecto para el cual se desean obtener las imágenes.
         * 
         * @returns {Promise<IProjectImage[]>} - Lista de imágenes asociadas al proyecto.
         */
        return await projectImageModel.getAllByProject(project_id)
    },

    getById: async (id: number) => {
        /**
         * Obtiene una imagen por su id.
         * 
         * Pasos:
         * 1. Llama al modelo `projectImageModel` para obtener la imagen.
         * 
         * @param {number} id - ID de la imagen.
         * 
         * @returns {IProjectImage} - El objeto de la imagen.
         */
        return await projectImageModel.getById(id)
    },

    create: async (project_id: number, project_image_data: any) => {
        /**
         * Crea una imagen asociada a un proyecto.
         * 
         * Pasos:
         * 1. Sube la imagen al servicio S3 utilizando `s3Service.uploadFile`, pasando la imagen y sus metadatos.
         * 2. Valida los datos de la imagen con `projectImageService.checkCreateData`.
         * 3. Si los datos son válidos, inserta la imagen en la base de datos utilizando `projectImageModel.create`.
         * 4. Devuelve la imagen asociada al proyecto.
         * 
         * @param {number} project_id - ID del proyecto al cual se va a asociar la imagen.
         * @param {any} project_image_data - Datos de la imagen, incluyendo el buffer, nombre y tipo MIME.
         * 
         * @returns {Promise<IProjectImage>} - La imagen asociada al proyecto recién creada.
         */
        const data = await s3Service.uploadFile(env.AWS_S3_FOLDER_PROJECT_IMAGES, project_image_data.buffer, project_image_data.originalname, project_image_data.mimetype)

        const error_message = projectImageService.checkCreateData(data)
        if(typeof error_message == 'string') throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)

        const project_image = await projectImageModel.create(project_id, data)

        return project_image
    },

    sync: async (project_id: number, project_images_data: any) => {
        /**
         * Sincroniza las imágenes de un proyecto con las recibidas.
         * 
         * Pasos:
         * 1. Obtiene todas las imágenes actuales del proyecto usando `projectImageService.getAllByProjectId`.
         * 2. Separa las imágenes recibidas en dos listas:
         *    - Imágenes existentes (que ya estaban en la base de datos y siguen presentes).
         *    - Imágenes nuevas (que son archivos tipo `File` o tienen un campo `buffer`).
         * 3. Compara las imágenes actuales con las recibidas:
         *    - Si una imagen actual no está en la nueva lista, se elimina usando `projectImageService.delete`.
         * 4. Sube las imágenes nuevas usando `projectImageService.create`.
         * 
         * @param {number} project_id - ID del proyecto cuyas imágenes se van a sincronizar.
         * @param {any[]} incoming_images - Lista de imágenes recibidas.
         * 
         * @returns {Promise<void>} - No retorna nada, pero realiza la sincronización completa de imágenes.
         */
        const existing_images = await projectImageService.getAllByProject(project_id)

        const new_images = project_images_data.filter(img => img.buffer || img instanceof File)
        const still_existing_urls = project_images_data
            .filter(img => !img.buffer && typeof img.url === 'string')
            .map(img => img.url)

        for (const image of existing_images) {
            if (!still_existing_urls.includes(image.url)) {
                await projectImageService.delete(image.id)
            }
        }

        for (const image of new_images) {
            await projectImageService.create(project_id, image)
        }
    },

    checkCreateData: (data:IProjectImage) => {
        /**
         * Valida los datos de una imagen antes de su creación.
         * 
         * Pasos:
         * 1. Valida que la URL proporcionada sea una URL válida utilizando una expresión regular.
         * 2. Si la URL no es válida, retorna un mensaje de error.
         * 3. Si la URL es válida, retorna `true` indicando que los datos son correctos.
         * 
         * @param {IProjectImage} data - Datos de la imagen, incluyendo la URL.
         * 
         * @returns {string | boolean} - Retorna un mensaje de error si la URL no es válida, o `true` si los datos son válidos.
         */
        const url_pattern = /^(https?:\/\/)?([\w\d-]+\.)+[\w-]{2,}(\/.*)?$/

        if(!url_pattern.test(data.url)) return `La url (${data.url}) no es valida`
        return true
    },


    deleteAllByProject: async (project_id: number) => {
        /**
         * Elimina todas las imágenes asociadas a un proyecto.
         * 
         * Pasos:
         * 1. Obtiene todas las imágenes asociadas al proyecto usando `projectImageService.getAllByProject`.
         * 2. Por cada imagen asociada, elimina el archivo correspondiente de S3 usando `s3Service.deleteFile`.
         * 3. Elimina las relaciones de imágenes en la base de datos usando `projectImageModel.deleteAllByProject`.
         * 
         * @param {number} project_id - ID del proyecto cuyas imágenes se van a eliminar.
         * 
         * @returns {Promise<number>} - El número de imágenes eliminadas de la base de datos.
         */
        const images: IProjectImage[] = await projectImageService.getAllByProject(project_id)

        for(let image of images){
            s3Service.deleteFile(env.AWS_S3_FOLDER_PROJECT_IMAGES, image.file_name)
        }

        return await projectImageModel.deleteAllByProject(project_id)
    },

    delete: async (id: number) => {
        /**
         * Elimina una iamgen asociada a un proyecto.
         * 
         * Pasos:
         * 2. Elimina el archivo correspondiente de S3 usando `s3Service.deleteFile`.
         * 3. Elimina la relación de la imágen en la base de datos usando `projectImageModel.delete`.
         * 
         * @param {number} project_id - ID del proyecto cuyas imágenes se van a eliminar.
         * 
         * @returns {Promise<number>} - El número de imágenes eliminadas de la base de datos.
         */
        const image = await projectImageService.getById(id)

        s3Service.deleteFile(env.AWS_S3_FOLDER_PROJECT_IMAGES, image.file_name)

        return await projectImageModel.delete(id)
    }
}