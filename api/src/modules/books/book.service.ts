import { env } from '@/config/config_env'
import { bookModel } from './Book'
import { IBook } from './book.interface'
import CustomError from '@/modules/customerror/CustomError'
import { universeService } from '@/modules/universes/universe.service'
import { sagaService } from '@/modules/sagas/saga.service'

export const bookService = {
    getById: async (book_id: number) => {
        /**
         * Obtiene un libro a través de su ID.
         * 
         * Pasos:
         * 1. Intenta obtener el libro por su ID.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {number} book_id - ID de el libro que se desea obtener.
         * 
         * @returns {IBook} El objeto `book` correspondiente al ID proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ningún libro con el ID dado.
        */
        let book: IBook = await bookModel.getById(book_id)

        if(!book) throw new CustomError('El libro no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await bookService.getAllData(book)
    },

    getByIdLite: async (book_id: number) => {
        /**
         * Obtiene un libro a través de su ID.
         * 
         * Pasos:
         * 1. Intenta obtener el libro por su ID.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {number} book_id - ID de el libro que se desea obtener.
         * 
         * @returns {IBook} El objeto `book` correspondiente al ID proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ningún libro con el ID dado.
        */
        let book: IBook = await bookModel.getById(book_id)

        if(!book) throw new CustomError('El libro no existe', 404, env.DATA_NOT_FOUND_CODE)

        return book
    },

    getByIdEditData: async (book_id: number) => {
        /**
         * Obtiene los datos de un libro, necesarios para editarlo a través de su ID.
         * 
         * Pasos:
         * 1. Intenta obtener el libro por su ID.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {number} project_id - ID del libro que se desea obtener.
         * 
         * @returns {IBook} El objeto `book` correspondiente al ID proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ningún libro con el ID dado.
        */
        let book: IBook = await bookModel.getById(book_id)

        if(!book) throw new CustomError('El libro no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await bookService.getAllEditData(book)
    },

    getBySagaAndTitle: async (saga_id: number, title: string) => {
        /**
         * Obtiene un libro de una saga a través de su title.
         * 
         * Pasos:
         * 1. Intenta obtener el libro por su title.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {number} saga_id - id de la saga al que pertenece el libro.
         * 
         * @param {string} title - título de el libro que se desea obtener.
         * 
         * @returns {IBook} El objeto `book` correspondiente al título proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ningún libro con el título dado.
        */
        const book: IBook = await bookModel.getBySagaAndTitle(saga_id, title)

        if(!book) throw new CustomError('El libro no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await bookService.getAllData(book)
    },

    getByUniverseAndTitle: async (universe_id: number, title: string) => {
        /**
         * Obtiene un libro de un universo a través de su title.
         * 
         * Pasos:
         * 1. Intenta obtener el libro por su title.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {number} universe_id - id del universo al que pertenece el libro.
         * 
         * @param {string} title - título de el libro que se desea obtener.
         * 
         * @returns {IBook} El objeto `book` correspondiente al título proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ningún libro con el título dado.
        */
        const book: IBook = await bookModel.getByUniverseAndTitle(universe_id, title)

        if(!book) throw new CustomError('El libro no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await bookService.getAllData(book)
    },

    getByProjectAndTitle: async (project_id: number, title: string) => {
        /**
         * Obtiene un libro de un projecto a través de su title.
         * 
         * Pasos:
         * 1. Intenta obtener el libro por su title.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {number} project_id - id del proyecto al que pertenece el libro.
         * 
         * @param {string} title - título de el libro que se desea obtener.
         * 
         * @returns {IBook} El objeto `book` correspondiente al título proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ningún libro con el título dado.
        */
        const book: IBook = await bookModel.getByProjectAndTitle(project_id, title)

        if(!book) throw new CustomError('El libro no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await bookService.getAllData(book)
    },

    getByProjectAndUniverseNameAndTitle: async (project_id: number, universe_name: string,  title: string) => {
        /**
         * Obtiene un libro de un projecto a través de su name y del title del universo.
         * 
         * Pasos:
         * 1. Intenta obtener el universo por su name y el id del proyecto.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, intenta obtener el libro por el id del universo y su title.
         * 4. Si no se encuentra, lanza un error `DataNotFound`.
         * 2. Si se encuentra, lo devuelve.
         * 
         * @param {number} project_id - id del proyecto al que pertenece el libro.
         * 
         * @param {string} universe_name - name del universo al que pertenece el libro.
         * 
         * @param {string} title - título de el libro que se desea obtener.
         * 
         * @returns {IBook} El objeto `book` correspondiente al title proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ningún universo con su name o book con su title dado.
        */
        const universe = await universeService.getByName(project_id, universe_name)

        const book: IBook = await bookModel.getByUniverseAndTitle(universe.id, title)

        if(!book) throw new CustomError('El libro no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await bookService.getAllData(book)
    },

    getByProjectAndUniverseNameAndSagaNameAndTitle: async (project_id: number, universe_name: string, saga_name: string,  title: string) => {
        /**
         * Obtiene un libro de un projecto a través de su title, del name del universo y del nama de la saga.
         * 
         * Pasos:
         * 1. Intenta obtener el universo por su `name` y el id del proyecto.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, intenta obtener la saga pro el id del universo y su `name`.
         * 4. Si no se encuentra, lanza un error `DataNotFound`.
         * 5. Si se encuentra, intenta obtener el libro por el id de la saga y su `title`.
         * 6. Si se encuentra, lo devuelve.
         * 
         * @param {number} project_id - id del proyecto al que pertenece el libro.
         * 
         * @param {string} universe_name - name del universo al que pertenece el libro.
         * 
         * @param {string} daga_name - name de la saga al que pertenece el libro.
         * 
         * @param {string} title - título de el libro que se desea obtener.
         * 
         * @returns {IBook} El objeto `book` correspondiente al name proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ningún universo o saga con los names dados o book con el title dato.
        */
        const universe = await universeService.getByName(project_id, universe_name)

        const saga = await sagaService.getByUniverseAndName(universe.id, saga_name)

        const book: IBook = await bookModel.getBySagaAndTitle(saga.id, title)

        if(!book) throw new CustomError('El libro no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await bookService.getAllData(book)
    },

    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene todos los libros a través de un proyecto.
         * 
         * Pasos:
         * 1. Intenta obtener los libros por id del proyecto.
         * 2. Si no se encuentren, lanza un error `DataNotFound`.
         * 3. Si se encuentren, los devuelve.
         * 
         * @param {number} project_id - project_id del proyecto.
         * 
         * @returns {IBook[]} El array `books` con los libros.
        */
        const books: IBook[] = await bookModel.getAllByProject(project_id)

        let final_books = []
        for(let book of books){
            final_books.push(await bookService.getAllData(book))
        }

        return final_books
    },

    getAllByUniverse: async (unvierse_id: number) => {
        /**
         * Obtiene todos los libros a través de un universo.
         * 
         * Pasos:
         * 1. Intenta obtener los libros por id del universo.
         * 2. Si no se encuentren, lanza un error `DataNotFound`.
         * 3. Si se encuentren, los devuelve.
         * 
         * @param {number} unvierse_id - unvierse_id del universo.
         * 
         * @returns {IBook[]} El array `books` con los libros.
        */
        const books: IBook[] = await bookModel.getAllByUniverse(unvierse_id)

        let final_books = []
        for(let book of books){
            final_books.push(await bookService.getAllData(book))
        }

        return final_books
    },

    getAllBySaga: async (saga_id: number) => {
        /**
         * Obtiene todos los lirbos a través de una saga.
         * 
         * Pasos:
         * 1. Intenta obtener los libros por id de la saga.
         * 2. Si no se encuentren, lanza un error `DataNotFound`.
         * 3. Si se encuentren, los devuelve.
         * 
         * @param {number} saga_id - saga_id del universo.
         * 
         * @returns {IBook[]} El array `books` con los libros.
        */
        const books: IBook[] = await bookModel.getAllByUniverse(saga_id)

        let final_books = []
        for(let book of books){
            final_books.push(await bookService.getAllData(book))
        }

        return final_books
    },

    getAllData: async (book: IBook) => {
        const book_with_all_data = {
            ...book
        }

        if(book_with_all_data.universe_id != null && (typeof book_with_all_data.universe_id === 'number' || typeof book_with_all_data.universe_id === 'string')){
            book_with_all_data.universe = await universeService.getByIdLite(book_with_all_data.universe_id)
        }

        if(book_with_all_data.saga_id != null && (typeof book_with_all_data.saga_id === 'number' || typeof book_with_all_data.saga_id === 'string')){
            book_with_all_data.saga = await sagaService.getById(book_with_all_data.saga_id)
        }

        return book_with_all_data
    },

    
    getAllEditData: async (book: IBook) => {
        const book_with_all_data = {
            ...book
        }

        return book_with_all_data
    },

    create: async (project_id: number, data: any) => {
        /**
         * Crea un nuevo libro a partir de los datos recibidos y el proyecto al que pertenece.
         * 
         * Pasos:
         * 1. Verifica si ya existia un libro con ese título en el proyecto.
         * 2. Valida la estructura de los datos de el libro.
         * 3. Crea el libro en la base de datos.
         * 4. Si la creación fue exitosa, crea las relaciones asociadas (imágenes, miembros, categorías, etc).
         * 5. Si ocurre algún error al crear relaciones, elimina el libro para evitar datos huérfanos.
         * 6. Retorna el libro creado.
         * 
         * @param {number} project_id - ID del proyecto al que pertenece el libro.
         * @param {any} data - Datos crudos recibidos desde el frontend.
         * 
         * @returns {IBook} - El libro creado correctamente.
         * 
         * @throws {CustomError} - Si hay errores de validación o duplicidad.
         */
        if(data.saga_id){
            if(await bookService.checkSagaHasBookWithSameTitle(data.universe_id, data.title)) throw new CustomError(`Ya existe un libro con ese título en esta saga`, 400, env.DUPLICATE_DATA_CODE)
        }
        else if(data.universe_id){
            if(await bookService.checkUniverseHasBookWithSameTitle(data.universe_id, data.title)) throw new CustomError(`Ya existe un libro con ese título en este universo`, 400, env.DUPLICATE_DATA_CODE)
        }else{
            if(await bookService.checkProjectHasBookWithSameTitle(project_id, data.title)) throw new CustomError(`Ya existe un libro con ese título en este proyecto`, 400, env.DUPLICATE_DATA_CODE)
        }

        const error_message = bookService.checkCreateData(data)
        if(typeof error_message == 'string') throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)

        const book = await bookModel.create(project_id, data)

        return await bookService.getById(book.id)
    },

    update: async (id:number, data: any) => {
        /**
         * Actualiza un nuevo libro a partir de los datos recibidos.
         * 
         * Pasos:
         * 1. Valida la estructura de los datos de el libro.
         * 2. Actualiza el libro en la base de datos.
         * 3. Retorna el libro creado.
         * 
         * @param {number} id - ID de el libro a editar.
         * @param {any} data - Datos crudos recibidos desde el frontend.
         * 
         * @returns {IBook} - El libro actualizdo correctamente.
         * 
         * @throws {CustomError} - Si hay errores de validación o duplicidad.
         */
        const error_message = bookService.checkUpdateData(data)
        if(typeof error_message == 'string') throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)

        let book_exists = undefined
        
        console.log(data)

        if(data.saga_id){
            book_exists = await bookModel.getBySagaAndTitle(data.saga_id, data.title)
        }
        else if(data.universe_id){
            book_exists = await bookModel.getByUniverseAndTitle(data.universe_id, data.title)
        }else{
            book_exists = await bookModel.getByProjectAndTitle(data.project_id, data.title)
        }

        console.log(book_exists)

        if(book_exists && book_exists.id != data.id) throw new CustomError('Ya existe un libro con este nombre', 400, env.DUPLICATE_DATA_CODE)

        const book = await bookModel.update(id, data)

        return await bookService.getById(id)
    },

    checkCreateData: (data: any) => {
        /**
         * Valida los campos requeridos para la creación de un libro.
         * 
         * Esta función comprueba que todos los campos necesarios estén presentes y cumplan con ciertas reglas de formato y contenido:
         * 
         * - El nombre no puede estar vacío ni tener menos de 2 caracteres.
         * - La sisnopsis no puede estar vacía.
         * - Debe pertenecer a un libro.
         * 
         * @param {Object} data - Datos de el libro a validar.
         * @param {string} data.title - Títutlo de el libro.
         * @param {string} data.synopsis - Sinopsis de el libro.
         * 
         * @returns {true|string} - `true` si todos los campos son válidos, o un mensaje de error en caso contrario.
        */

        if(!data.title || !data.title.trim()) return 'El título no puede estar vacío'
        if(data.title.length < 2) return 'El título debe tener dos caracteres mínimo'
        if(!data.synopsis || !data.synopsis.trim()) return 'El libro debe incluir una sinopsis'

        return true
    },

    checkUpdateData: (data: any) => {
        /**
         * Valida los campos requeridos para la edición de un libro.
         * 
                  * Esta función comprueba que todos los campos necesarios estén presentes y cumplan con ciertas reglas de formato y contenido:
         * 
         * - El nombre no puede estar vacío ni tener menos de 2 caracteres.
         * - La sisnopsis no puede estar vacía.
         * - Debe pertenecer a un libro.
         * 
         * @param {Object} data - Datos de el libro a validar.
         * @param {string} data.title - Títutlo de el libro.
         * @param {string} data.synopsis - Sinopsis de el libro.
         * 
         * @returns {true|string} - `true` si todos los campos son válidos, o un mensaje de error en caso contrario.
        */

        if(!data.title || !data.title.trim()) return 'El título no puede estar vacío'
        if(data.title.length < 2) return 'El título debe tener dos caracteres mínimo'
        if(!data.synopsis || !data.synopsis.trim()) return 'El libro debe incluir una sinopsis'

        return true
    },

    checkProjectHasBookWithSameTitle: async (project_id: number, title: string) => {
        /**
        * Devuelve el libro que coincide en el title
        * 
        * @param {number} project_id - Id del proyecto.
        * @param {string} title - Título de el libro.
        * 
        * @returns {IBook} -Objeto book.
        */
        return await bookModel.getByProjectAndTitle(project_id, title)
    },

    checkUniverseHasBookWithSameTitle: async (universe_id: number, title: string) => {
        /**
        * Devuelve el libro que coincide en el title
        * 
        * @param {number} universe_id - Id del universo.
        * @param {string} title - Título de el libro.
        * 
        * @returns {ISaga} -Objeto saga.
        */
        return await bookModel.getByUniverseAndTitle(universe_id, title)
    },

    checkSagaHasBookWithSameTitle: async (saga_id: number, title: string) => {
        /**
        * Devuelve el libro que coincide en el title
        * 
        * @param {number} saga_id - Id de la saga.
        * @param {string} title - Título de el libro.
        * 
        * @returns {ISaga} -Objeto saga.
        */
        return await bookModel.getBySagaAndTitle(saga_id, title)
    },

    delete: async (book_id: number) => {
        /**
         * Elimina un libro y todas sus relaciones asociadas.
         * 
         * Pasos:
         * 1. Verifica si el libro existe.
         * 2. ELimina los eventos asociados a el libro.
         * 3. ELimina los personajes asociados a el libro.
         * 4. ELimina los lugares asociados a el libro.
         * 
         * @param {number} book_id - ID de el libro a eliminar.
         * 
         * @returns {boolean} `true` si el libro fue eliminado correctamente.
         * 
         * @throws {CustomError} Si el libro no existe.
         */
        const book = await bookService.getById(book_id)
        if(!book) throw new CustomError('El libro no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await bookModel.delete(book_id)
    },

    deleteAllBySaga: async (saga_id: number) => {
        /**
         * Elimina todas las libros pertenecientes a una saga.
         * 
         * @param {number} saga_id - ID del saga al que pertenecen las books.
         */
        const books = await bookService.getAllBySaga(saga_id)

        for (let book of books) {
            await bookService.delete(book.id)
        }
    },

    deleteAllByUniverse: async (universe_id: number) => {
        /**
         * Elimina todas las libros pertenecientes a un universo.
         * 
         * @param {number} universe_id - ID del universo al que pertenecen las books.
         */
        const books = await bookService.getAllByUniverse(universe_id)

        for (let book of books) {
            await bookService.delete(book.id)
        }
    },

    deleteAllByProject: async (project_id: number) => {
        /**
         * Elimina todas las libros pertenecientes a un proyecto.
         * 
         * @param {number} project_id - ID del proyecto al que pertenecen las books.
         */
        const books = await bookService.getAllByProject(project_id)

        for (let book of books) {
            await bookService.delete(book.id)
        }
    },
}