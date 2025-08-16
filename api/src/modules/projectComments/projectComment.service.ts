import { env } from '@/config/config_env'
import { projectCommentModel } from './ProjectComment'
import { projectCommentLikeService } from './projectCommentLike.service'
import CustomError from '@/modules/customerror/CustomError'
import { userService } from '@/modules/users/user.service'
import { IProjectComment } from './projectComment.interface'

export const projectCommentService = {
    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene todos los comentarios de un proyecto por su ID.
         * 
         * @param {number} project_id - ID del proyecto del cual se quieren obtener los comentarios.
         * 
         * @returns {IProjectComment[]} Lista de comentarios con los datos del autor y los likes incluidos.
         */
        const comments: IProjectComment[] = await projectCommentModel.getAllByProject(project_id)

        // Para cada comentario, obtener el autor y los likes
        for (let comment of comments) {
            comment.created_by = await userService.getById(typeof comment.created_by == 'number' ? comment.created_by : null)
            
            // Obtener likes del comentario
            const likes = await projectCommentLikeService.getByComment(comment.id)
            comment.likes = likes
        }

        return comments
    },

    getById: async (comment_id: number) => {
        /**
         * Obtiene un comentario de un proyecto incluyendo el autor y los likes.
         * 
         * @param {number} comment_id - ID del comentario.
         * @returns {IProjectComment[]} Comentario con los datos de autor y likes.
         */
        const comment = await projectCommentModel.getById(comment_id)

        if (!comment) throw new CustomError('Comentario no encontrado', 404, env.DATA_NOT_FOUND_CODE)

        // Obtener el autor
        comment.created_by = await userService.getById(comment.created_by)

        // Obtener likes del comentario
        comment.likes = await projectCommentLikeService.getByComment(comment.id)

        return comment
    },

    getProyectCount: async (project_id: number) => {
        /**
         * Obtiene el número de comentarios de un proyecto
         * 
         * @param {number} project_id - ID del proyecto.
         * @returns {number} Número de comentarios.
         */

        return await projectCommentModel.getProyectCount(project_id)
    },

    create: async (data_to_create: IProjectComment) => {
        /**
         * Crea un nuevo comentario en un proyecto.
         * 
         * @param {number} data.created_by - ID del usuario que realiza el comentario.
         * @param {number} data.project_id - ID del proyecto sobre el que se comenta.
         * @param {string} data.content - Contenido del comentario.
         * 
         * @returns {IProjectComment} Comentario creado.
         * 
         * @throws {CustomError} Si el contenido está vacío o no se puede crear.
         */
        const error_message = projectCommentService.checkCreateData(data_to_create)
        if(typeof error_message == 'string') throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)

        const comment_created = await projectCommentModel.create(data_to_create)

        if (!comment_created) throw new CustomError('Error al crear el comentario', 500)

        return projectCommentService.getById(comment_created.id)
    },

    delete: async (comment_id: number, user_id: number) => {
        /**
         * Elimina un comentario si pertenece al usuario.
         * 
         * @param {number} comment_id - ID del comentario a eliminar.
         * @param {number} user_id - ID del usuario que solicita la eliminación.
         * 
         * @returns {boolean} `true` si el comentario fue eliminado correctamente.
         * 
         * @throws {CustomError} Si el comentario no existe o el usuario no tiene permiso para eliminarlo.
         */
        const comment = await projectCommentModel.getById(comment_id)

        if (!comment)  throw new CustomError('El comentario no existe', 404, env.DATA_NOT_FOUND_CODE)

        if (comment.created_by !== user_id) throw new CustomError('No tiene permiso para eliminar este comentario', 403, env.UNAUTHORIZED_CODE)

        await projectCommentLikeService.deleteAllByComment(comment.id)

        return await projectCommentModel.delete(comment_id)
    },

    deleteAllByProject: async (project_id: number) => {
        /**
         * Elimina todos los comentarios de un proyecto y sus likes asociados.
         * 
         * @param {number} project_id - ID del proyecto.
         */
        const comments = await projectCommentModel.getAllByProject(project_id)
    
        for (const comment of comments) {
            await projectCommentLikeService.deleteAllByComment(comment.id)
        }
    
        await projectCommentModel.deleteAllByProject(project_id)
    },

    toggleLike: async (comment_id: number, user_id: number) => {
        /**
         * Alterna el "like" en un comentario: lo agrega si no existe o lo elimina si ya existe.
         * 
         * @param {number} comment_id - ID del comentario.
         * @param {number} user_id - ID del usuario que da/quita el like.
         * @returns {Object} Estado actualizado del like.
         */
        const exists = await projectCommentLikeService.getByCommentAndUser(comment_id, user_id)

        if (exists) {
            // Si el like ya existe, lo eliminamos
            await projectCommentLikeService.removeLike(comment_id, user_id)
            return { liked: false }
        } else {
            // Si no existe el like, lo agregamos
            await projectCommentLikeService.addLike(comment_id, user_id)
            return { liked: true }
        }
    },

    checkCreateData: (data: IProjectComment) => {
        /**
         * Valida los campos requeridos para la creación o edición de un proyecto.
         * 
         * Esta función comprueba que todos los campos necesarios estén presentes y cumplan con ciertas reglas de formato y contenido:
         * 
         * - El nombre no puede estar vacío ni tener menos de 2 caracteres.
         * - La descripción no puede estar vacía.
         * - Debe incluir al menos una categoría.
         * - Debe incluir al menos una imagen.
         * - Las URLs proporcionadas en los sitios y videos deben ser válidas.
         * - Cada sitio debe tener un proveedor definido.
         * - La visibilidad debe ser 'public' o 'private'.
         * 
         * @param {Object} data - Datos del proyecto a validar.
         * @param {number} data.created_by - Id del usuario que comenta.
         * @param {number} data.project_id - Id del proyecto.
         * @param {string} data.content - Contenido del comentario.
         * 
         * @returns {true|string} - `true` si todos los campos son válidos, o un mensaje de error en caso contrario.
        */

        if(!data.created_by) return 'Debe indicar el usaurio que comenta'
        if(!data.project_id) return 'Debe indicar al proyecto que pertenece el comentario'
        if(!data.content || data.content.trim() == '') return 'Debe escribir un comentario'

        return true
    },
}
