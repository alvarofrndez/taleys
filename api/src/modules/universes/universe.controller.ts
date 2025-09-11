import { Response, NextFunction } from 'express'
import { universeService } from './universe.service'
import CustomError from '@/modules/customerror/CustomError'
import { env } from '@/config/config_env'

export const universeController = {
    getById: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener un universo por su ID.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar un universo específico 
         * utilizando el `universe_id` proporcionado en los parámetros de la URL.
        */
        const { universe_id } = req.params

        const universe = await universeService.getById(universe_id)

        res.status(200).json({
            success: true,
            data: universe,
            message: 'Universo obtenido'
        })
    },

    getByIdLite: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener un universo por su ID.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar un universo específico 
         * utilizando el `universe_id` proporcionado en los parámetros de la URL.
        */
        const { universe_id } = req.params

        const universe = await universeService.getByIdLite(universe_id)

        res.status(200).json({
            success: true,
            data: universe,
            message: 'Universo obtenido'
        })
    },

    getBySlug: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener un universo a través de su slug.
         */
        const { project_id, universe_slug } = req.params

        let universe = await universeService.getBySlug(project_id, universe_slug)

        res.status(200).json({
            success: true,
            data: universe,
            message: 'Universo obtenido'
        })
    },

    getAllByProject: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener todos los universos de un projecto a través del project_id.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar todos los universos 
         * utilizando el `project_id` proporcionado en los parámetros de la URL.
        */
        const { project_id } = req.params

        let projects = await universeService.getAllByProject(project_id)
        
        res.status(200).json({
            success: true,
            data: projects,
            message: 'Universos obtenidos'
        })
    },

    create: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para crear un universo.
         * 
         * Este endpoint maneja una solicitud HTTP POST para crear un universo
         * con los datos que le llegan en el body de la pateción.
        */
        const { project_id } = req.params
        const data = req.body

        const universe = await universeService.create(project_id, data)

        res.status(200).json({
            success: true,
            data: universe,
            message: 'Universo creado'
        })
    },

    update: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para actualizar un universo.
         * 
         * Este endpoint maneja una solicitud HTTP POST para actualizar un universo
         * con los datos que le llegan en el body de la pateción.
        */
        const { universe_id } = req.params
        const data = req.body

        const universe = await universeService.update(universe_id, data)

        res.status(200).json({
            success: true,
            data: universe,
            message: 'Universo actualizado'
        })
    },

    delete: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para eliminar un universo.
         */
        const { universe_id } = req.params

        const deleted = await universeService.delete(universe_id)

        if (deleted) {
            res.status(200).json({
                success: true,
                message: 'Universo eliminado'
            })
        } else {
            throw new CustomError('Error al eliminar el universo', 400, env.INVALID_DATA_CODE)
        }
    }
}