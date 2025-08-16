import { Response, NextFunction } from 'express'
import { bookService } from '@/modules/books/book.service'
import CustomError from '@/modules/customerror/CustomError'
import { env } from '@/config/config_env'

export const bookUniverseController = {
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
         * Controlador para obtener un libro a través de su name.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar un libro
         * utilizando el `book_title` y el `universe_id` proporcionado en los parámetros de la URL.
        */
        const { universe_id, book_title } = req.params

        let book = await bookService.getByUniverseAndTitle(universe_id, book_title)

        res.status(200).json({
            success: true,
            data: book,
            message: 'Libro obtenido'
        })
    },

    getAllByUniverse: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para obtener todos los Libros de un universo a través del universe_id.
         * 
         * Este endpoint maneja una solicitud HTTP GET para recuperar todos los Libros 
         * utilizando el `universe_id` proporcionado en los parámetros de la URL.
        */
        const { universe_id } = req.params

        let projects = await bookService.getAllByUniverse(universe_id)
        
        res.status(200).json({
            success: true,
            data: projects,
            message: 'Libros obtenidas'
        })
    },

    create: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Controlador para crear un libro.
         * 
         * Este endpoint maneja una solicitud HTTP POST para crear un libro
         * con los datos que le llegan en el body de la pateción asignandoselo al
         * usuario correspondiente.
        */
        const { project_id, universe_id } = req.params
        const data = req.body

        data.universe_id = universe_id

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
         * Este endpoint maneja una solicitud HTTP POST para actualizar un book
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
                message: 'Libro eliminadao'
            })
        } else {
            throw new CustomError('Error al eliminar el libro', 400, env.INVALID_DATA_CODE)
        }
    }
}