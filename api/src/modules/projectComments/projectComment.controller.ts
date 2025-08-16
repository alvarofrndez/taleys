import { Response, NextFunction } from 'express'
import { projectCommentService } from './projectComment.service'
import CustomError from '@/modules/customerror/CustomError'
import { env } from '@/config/config_env'
import { IProjectComment } from './projectComment.interface'
import { projectCommentLikeService } from './projectCommentLike.service'

export const projectCommentController = {
    getAllByProject: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Obtiene todos los comentarios de un proyecto por su ID.
         */
        const { project_id } = req.params

        const comments = await projectCommentService.getAllByProject(project_id)

        res.status(200).json({
            success: true,
            data: comments,
            message: 'Comentarios del proyecto obtenidos'
        })
    },

    getById: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener los comentarios de un proyecto por su ID.
         */
        const { comment_id } = req.params

        const comments = await projectCommentService.getById(comment_id)

        res.status(200).json({
            success: true,
            data: comments,
            message: 'Comentario obtenido'
        })
    },

    create: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para crear un comentario en un proyecto.
         */
        const { project_id } = req.params
        const user = req.user_me
        const { content } = req.body

        if (!content || content.trim() === '') throw new CustomError('El contenido no puede estar vacío', 400, env.INVALID_DATA_CODE)

        const comment = await projectCommentService.create({project_id, created_by: user.id, content})

        res.status(201).json({
            success: true,
            data: comment,
            message: 'Comentario publicado'
        })
    },

    delete: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para eliminar un comentario de un proyecto.
         */
        const { comment_id } = req.params
        const user = req.user_me

        const deleted = await projectCommentService.delete(comment_id, user.id)

        if (!deleted) throw new CustomError('No tienes permiso para eliminar este comentario', 403, env.UNAUTHORIZED_CODE)

        res.status(200).json({
            success: true,
            message: 'Comentario eliminado'
        })
    },

    like: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para dar like o quitar like a un comentario.
         * Se modifica la lógica para utilizar el servicio de like.
         */
        const { comment_id } = req.params
        const user = req.user_me

        // Verificar si el comentario ya tiene like por el usuario
        const like = await projectCommentLikeService.getByCommentAndUser(comment_id, user.id)

        if (like) {
            // Si ya existe un like, lo eliminamos (quitar like)
            await projectCommentLikeService.removeLike(comment_id, user.id)
            res.status(200).json({
                success: true,
                message: 'Like removido'
            })
        } else {
            // Si no existe un like, lo agregamos (dar like)
            await projectCommentLikeService.addLike(comment_id, user.id)
            res.status(200).json({
                success: true,
                message: 'Like agregado'
            })
        }
    }
}