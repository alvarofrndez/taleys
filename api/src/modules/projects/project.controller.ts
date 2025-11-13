import { Response, NextFunction } from 'express'
import { projectService } from './project.service'
import CustomError from '@/modules/customerror/CustomError'
import { env } from '@/config/config_env'
import { IProject } from './project.interface'
import { projectLikeService } from './projectLike.service'
import { projectSaveService } from './projectSave.service'

export const projectController = {
    getById: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener un proyecto por su ID.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar un proyecto específico 
         * utilizando el `project_id` proporcionado en los parámetros de la URL.
        */
        const { project_id } = req.params

        const project = await projectService.getById(project_id)

        const can_res = projectService.checkVisibility(project, req)

        if(can_res){
            res.status(200).json({
                success: true,
                data: project,
                message: 'Proyecto obtenido'
            })
        }else{
            throw new CustomError('El proyecto no existe', 404, env.DATA_NOT_FOUND_CODE)
        }
    },

    getByIdLite: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener un proyecto por su ID.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar un proyecto específico 
         * utilizando el `project_id` proporcionado en los parámetros de la URL.
        */
        const { project_id } = req.params

        const project = await projectService.getByIdLite(project_id)
        
        const can_res = projectService.checkVisibility(project, req)

        if(can_res){
            res.status(200).json({
                success: true,
                data: project,
                message: 'Proyecto obtenido'
            })
        }else{
            throw new CustomError('El proyecto no existe', 404, env.DATA_NOT_FOUND_CODE)
        }
    },

    getAllByName: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener todos los proyecto a traves de un name.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar todos los proyectos 
         * utilizando el `project_name` proporcionado en los parámetros de la URL.
        */
        const { project_name } = req.params

        let projects = await projectService.getAllByName(project_name)

        projects = projects.filter(project => 
            projectService.checkVisibility(project, req)
        )
        
        res.status(200).json({
            success: true,
            data: projects,
            message: 'Proyectos obtenidos'
        })
    },

    getBySlug: async (req: any, res: Response, next: NextFunction) => {
        const { project_slug } = req.params

        const project = await projectService.getBySlug(project_slug)

        const can_res = projectService.checkVisibility(project, req)

        if(can_res){
            res.status(200).json({
                success: true,
                data: project,
                message: 'Proyecto obtenido'
            })
        }else{
            throw new CustomError('El proyecto no existe', 404, env.DATA_NOT_FOUND_CODE)
        }
    },

    getByUserAndName: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener un proyecto del usuario a través de su ID de su name.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar un proyecto de un usuario
         * utilizando el `user_id` y el `project_name` proporcionados en los parámetros de la URL.
        */
        const { project_name, user_id } = req.params

        let project = await projectService.getByUserAndName(project_name, user_id)
        
        const can_res = projectService.checkVisibility(project, req)

        if(can_res){
            res.status(200).json({
                success: true,
                data: project,
                message: 'Proyecto obtenido'
            })
        }else{
            throw new CustomError('El proyecto no existe', 404, env.DATA_NOT_FOUND_CODE)
        }
    },

    getByUserAndSlug: async (req: any, res: Response, next: NextFunction) => {
        const { project_slug, user_id } = req.params

        let project = await projectService.getByUserAndSlug(project_slug, user_id)
        
        const can_res = projectService.checkVisibility(project, req)

        if(can_res){
            res.status(200).json({
                success: true,
                data: project,
                message: 'Proyecto obtenido'
            })
        }else{
            throw new CustomError('El proyecto no existe', 404, env.DATA_NOT_FOUND_CODE)
        }
    },

    getByUserUsernameAndName: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener un proyecto del usuario a través del username del usuario y de su name.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar un proyecto de un usuario
         * utilizando el `username` y el `project_name` proporcionados en los parámetros de la URL.
        */
        const { project_name, username } = req.params

        let project = await projectService.getByUserUsernameAndName(project_name, username)
        
        const can_res = projectService.checkVisibility(project, req)

        if(can_res){
            res.status(200).json({
                success: true,
                data: project,
                message: 'Proyecto obtenido'
            })
        }else{
            throw new CustomError('El proyecto no existe', 404, env.DATA_NOT_FOUND_CODE)
        }
    },

    getByUserUsernameAndSlug: async (req: any, res: Response, next: NextFunction) => {
        const { project_slug, username } = req.params

        let project = await projectService.getByUserUsernameAndSlug(project_slug, username)
        
        const can_res = projectService.checkVisibility(project, req)

        if(can_res){
            res.status(200).json({
                success: true,
                data: project,
                message: 'Proyecto obtenido'
            })
        }else{
            throw new CustomError('El proyecto no existe', 404, env.DATA_NOT_FOUND_CODE)
        }
    },

    getAllByUser: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener todo los proyectos de un usuario a través de su ID.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar todos los proyectos de un usuario
         * utilizando el `user_id` proporcionado en los parámetros de la URL.
        */
        const { user_id } = req.params

        let projects = await projectService.getAllByUser(user_id)

        projects = projects.filter(project => 
            projectService.checkVisibility(project, req)
        )
        
        res.status(200).json({
            success: true,
            data: projects,
            message: 'Proyectos obtenidos'
        })
    },

    create: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para crear un proyecto.
         * 
         * Este endpoint maneja una solicitud HTTP POST para crear un proyecto
         * con los datos que le llegan en el body de la pateción asignandoselo al
         * usuario correspondiente.
         * Añade las imagenes que llegan en la variable files a los datos del proyecto
        */
        const data = req.body
        const user = req.user_me

        const project = await projectService.create(user.id, data)

        res.status(200).json({
            success: true,
            data: project,
            message: 'Proyecto creado'
        })
    },

    update: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para actualizar un proyecto.
         * 
         * Este endpoint maneja una solicitud HTTP POST para actualizar un proyecto
         * con los datos que le llegan en el body de la pateción asignandoselo al
         * usuario correspondiente.
         * Añade las imagenes que llegan en la variable files a los datos del proyecto
        */
        const { project_id } = req.params
        const data = req.body
        const user = req.user_me

        const project = await projectService.update(project_id, user.id, data)

        res.status(200).json({
            success: true,
            data: project,
            message: 'Proyecto actualizado'
        })
    },

    like: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para dar like o quitar like a un proyecto.
         */
        const { project_id } = req.params
        const user = req.user_me

        const like = await projectLikeService.getByProjectAndUser(project_id, user.id)

        if (like) {
            await projectLikeService.removeLike(project_id, user.id)
            res.status(200).json({
                success: true,
                message: 'Like removido'
            })
        } else {
            await projectLikeService.addLike(project_id, user.id)
            res.status(200).json({
                success: true,
                message: 'Like agregado'
            })
        }
    },

    save: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para guardar un proyecto.
         */
        const { project_id } = req.params
        const user = req.user_me

        const save = await projectSaveService.getByProjectAndUser(project_id, user.id)

        if (save) {
            await projectSaveService.removeSave(project_id, user.id)
            res.status(200).json({
                success: true,
                message: 'Proyecto quitado'
            })
        } else {
            await projectSaveService.addSave(project_id, user.id)
            res.status(200).json({
                success: true,
                message: 'Proyecto guardado'
            })
        }
    },

    delete: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para eliminar un proyecto.
         */
        const { project_id } = req.params

        const deleted = await projectService.delete(project_id)

        if (deleted) {
            res.status(200).json({
                success: true,
                message: 'Proyecto eliminado'
            })
        } else {
            throw new CustomError('Error al eliminar el proyecto', 400, env.INVALID_DATA_CODE)
        }
    }
}