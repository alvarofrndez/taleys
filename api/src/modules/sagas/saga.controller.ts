import { Response, NextFunction } from 'express'
import { sagaService } from './saga.service'
import CustomError from '@/modules/customerror/CustomError'
import { env } from '@/config/config_env'

export const sagaController = {
    getById: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener una saga por su ID.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar una saga específica
         * utilizando el `saga_id` proporcionado en los parámetros de la URL.
        */
        const { saga_id } = req.params

        const saga = await sagaService.getById(saga_id)

        res.status(200).json({
            success: true,
            data: saga,
            message: 'Saga obtenida'
        })
    },

    getByIdLite: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener una saga por su ID.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar una saga específico 
         * utilizando el `saga_id` proporcionado en los parámetros de la URL.
        */
        const { saga_id } = req.params

        const saga = await sagaService.getByIdLite(saga_id)

        res.status(200).json({
            success: true,
            data: saga,
            message: 'Saga obtenida'
        })
    },

    getBySlug: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener una saga a través de su slug.
         */
        const { project_id, saga_slug } = req.params

        let saga = await sagaService.getByProjectAndSlug(project_id, saga_slug)

        res.status(200).json({
            success: true,
            data: saga,
            message: 'Saga obtenida'
        })
    },

    getByProjectAndUniverseSlugAndSlug: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener una saga a través del slug del universo y su slug.
         */
        const { project_id, universe_slug, saga_slug } = req.params

        let saga = await sagaService.getByProjectAndUniverseSlugAndSlug(project_id, universe_slug, saga_slug)

        res.status(200).json({
            success: true,
            data: saga,
            message: 'Saga obtenida'
        })
    },

    getAllByProject: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener todos los Sagas de un projecto a través del project_id.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar todos los Sagas 
         * utilizando el `project_id` proporcionado en los parámetros de la URL.
        */
        const { project_id } = req.params

        let projects = await sagaService.getAllByProject(project_id)
        
        res.status(200).json({
            success: true,
            data: projects,
            message: 'Sagas obtenidas'
        })
    },

    create: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para crear un proyectouna saga.
         * 
         * Este endpoint maneja una solicitud HTTP POST para crear una saga
         * con los datos que le llegan en el body de la pateción.
        */
        const { project_id } = req.params
        const data = req.body

        const saga = await sagaService.create(project_id, data)

        res.status(200).json({
            success: true,
            data: saga,
            message: 'Saga creada'
        })
    },

    update: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para actualizar una saga.
         * 
         * Este endpoint maneja una solicitud HTTP POST para actualizar una saga
         * con los datos que le llegan en el body de la pateción.
        */
        const { saga_id } = req.params
        const data = req.body

        const saga = await sagaService.update(saga_id, data)

        res.status(200).json({
            success: true,
            data: saga,
            message: 'Saga actualizada'
        })
    },

    delete: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para eliminar una saga.
         */
        const { saga_id } = req.params

        const deleted = await sagaService.delete(saga_id)

        if (deleted) {
            res.status(200).json({
                success: true,
                message: 'Saga eliminada'
            })
        } else {
            throw new CustomError('Error al eliminar el saga', 400, env.INVALID_DATA_CODE)
        }
    }
}