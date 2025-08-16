import { Response, NextFunction } from 'express'
import { sagaService } from '@/modules/sagas/saga.service'
import CustomError from '@/modules/customerror/CustomError'
import { env } from '@/config/config_env'

export const sagaUniverseController = {
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

    getByName: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener una saga a través de su name.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar una saga
         * utilizando el `saga_name` y el `universe_id` proporcionado en los parámetros de la URL.
        */
        const { universe_id, saga_name } = req.params

        let saga = await sagaService.getByUniverseAndName(universe_id, saga_name)

        res.status(200).json({
            success: true,
            data: saga,
            message: 'Saga obtenida'
        })
    },

    getAllByUniverse: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener todos los Sagas de un universo a través del universe_id.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar todos los Sagas 
         * utilizando el `universe_id` proporcionado en los parámetros de la URL.
        */
        const { universe_id } = req.params

        let projects = await sagaService.getAllByUniverse(universe_id)
        
        res.status(200).json({
            success: true,
            data: projects,
            message: 'Sagas obtenidas'
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
        const { project_id, universe_id } = req.params
        const data = req.body

        data.universe_id = universe_id

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
         * Este endpoint maneja una solicitud HTTP POST para actualizar un saga
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