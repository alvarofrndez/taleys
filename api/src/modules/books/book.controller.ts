import { Response, NextFunction } from 'express'
import { bookService } from './book.service'
import CustomError from '@/modules/customerror/CustomError'
import { env } from '@/config/config_env'

export const bookController = {
    getById: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener un libro por su ID.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar un libro específica
         * utilizando el `book_id` proporcionado en los parámetros de la URL.
        */
        const { book_id } = req.params

        const book = await bookService.getById(book_id)

        res.status(200).json({
            success: true,
            data: book,
            message: 'Libro obtenido'
        })
    },

    getByIdLite: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener un libro por su ID.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar un libro específico 
         * utilizando el `book_id` proporcionado en los parámetros de la URL.
        */
        const { book_id } = req.params

        const book = await bookService.getByIdLite(book_id)

        res.status(200).json({
            success: true,
            data: book,
            message: 'Libro obtenido'
        })
    },

    getByTitle: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener un libro a través de su título.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar un libro
         * utilizando el `book_title` y el `project_id` proporcionado en los parámetros de la URL.
        */
        const { project_id, book_title } = req.params

        let book = await bookService.getByProjectAndTitle(project_id, book_title)

        res.status(200).json({
            success: true,
            data: book,
            message: 'Libro obtenido'
        })
    },

    getByProjectAndUniverseNameAndTitle: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener un libro a través de su title y el name del universo.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar un libro
         * utilizando el `book_title` y el `universe_name` proporcionado en los parámetros de la URL.
        */
        const { project_id, universe_name, book_title } = req.params

        let book = await bookService.getByProjectAndUniverseNameAndTitle(project_id, universe_name, book_title)

        res.status(200).json({
            success: true,
            data: book,
            message: 'Libro obtenido'
        })
    },

    getByProjectAndUniverseNameAndSagaNameAndTitle: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener un libro a través de su title, el name del universo y el name de la saga.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar un libro
         * utilizando el `book_title`, el `universe_name` y el `saga_name` proporcionado en los parámetros de la URL.
        */
        const { project_id, universe_name, saga_name, book_title } = req.params

        let book = await bookService.getByProjectAndUniverseNameAndSagaNameAndTitle(project_id, universe_name, saga_name, book_title)

        res.status(200).json({
            success: true,
            data: book,
            message: 'Libro obtenido'
        })
    },

    getAllByProject: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener todos los libros de un projecto a través del project_id.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar todos los libros 
         * utilizando el `project_id` proporcionado en los parámetros de la URL.
        */
        const { project_id } = req.params

        let projects = await bookService.getAllByProject(project_id)
        
        res.status(200).json({
            success: true,
            data: projects,
            message: 'Libros obtenidos'
        })
    },

    create: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para crear un proyectoun libro.
         * 
         * Este endpoint maneja una solicitud HTTP POST para crear un libro
         * con los datos que le llegan en el body de la pateción.
        */
        const { project_id } = req.params
        const data = req.body

        const book = await bookService.create(project_id, data)

        res.status(200).json({
            success: true,
            data: book,
            message: 'Libro creado'
        })
    },

    update: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para actualizar un libro.
         * 
         * Este endpoint maneja una solicitud HTTP POST para actualizar un libro
         * con los datos que le llegan en el body de la pateción.
        */
        const { book_id } = req.params
        const data = req.body

        const book = await bookService.update(book_id, data)

        res.status(200).json({
            success: true,
            data: book,
            message: 'Libro actualizado'
        })
    },

    delete: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para eliminar un libro.
         */
        const { book_id } = req.params

        const deleted = await bookService.delete(book_id)

        if (deleted) {
            res.status(200).json({
                success: true,
                message: 'Libro eliminado'
            })
        } else {
            throw new CustomError('Error al eliminar el book', 400, env.INVALID_DATA_CODE)
        }
    }
}