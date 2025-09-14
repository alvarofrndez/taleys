import { env } from '@/config/config_env'
import { bookModel } from './Book'
import { IBook } from './book.interface'
import CustomError from '@/modules/customerror/CustomError'
import { universeService } from '@/modules/universes/universe.service'
import { sagaService } from '@/modules/sagas/saga.service'
import { generateUniqueSlug } from '@/utils/slugify/generateUniqueSlug'
import { characterService } from '@/modules/characters/character.service'
import { CharacterBelongingLevel } from '@/modules/characters/character.interface'

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

    getByIdLiteWithParentsLite: async (book_id: number) => {
        /**
         * Obtiene un libro a través de su ID, obteniendo los objetos lite de sus elementos narrativos padres.
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


        if(book.universe_id != null && (typeof book.universe_id === 'number' || typeof book.universe_id === 'string')){
            book.universe = await universeService.getByIdLite(book.universe_id)
        }

        if(book.saga_id != null && (typeof book.saga_id === 'number' || typeof book.saga_id === 'string')){
            book.saga = await sagaService.getByIdLite(book.saga_id)
        }

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

    getByProjectAndSlug: async (project_id: number, book_slug: string) => {
        const book: IBook = await bookModel.getByProjectAndSlug(project_id, book_slug)

        if(!book) throw new CustomError('El libro no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await bookService.getAllData(book)
    },

    getByProjectAndUniverseNameAndTitle: async (project_id: number, universe_name: string,  title: string) => {
        const universe = await universeService.getByName(project_id, universe_name)

        const book: IBook = await bookModel.getByUniverseAndTitle(universe.id, title)

        if(!book) throw new CustomError('El libro no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await bookService.getAllData(book)
    },

    getByProjectAndUniverseSlugAndSlug: async (project_id: number, universe_slug: string,  slug: string) => {
        const universe = await universeService.getBySlug(project_id, universe_slug)

        const book: IBook = await bookModel.getByUniverseAndSlug(universe.id, slug)

        if(!book) throw new CustomError('El libro no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await bookService.getAllData(book)
    },

    getByProjectAndUniverseSlugAndSagaSlugAndSlug: async (project_id: number, universe_slug: string, saga_slug: string,  book_slug: string) => {
        const universe = await universeService.getBySlug(project_id, universe_slug)

        const saga = await sagaService.getByUniverseAndSlug(universe.id, saga_slug)

        const book: IBook = await bookModel.getBySagaAndSlug(saga.id, book_slug)

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
        const books: IBook[] = await bookModel.getAllBySaga(saga_id)


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
            book_with_all_data.saga = await sagaService.getByIdLite(book_with_all_data.saga_id)
        }

        book_with_all_data.characters = await characterService.listByBelonging('book', book.id)

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
         * 1. Verifica si ya existia un libro con ese título en el proyecto, universo o saga.
         * 2. Genera un slug único basado en el título.
         * 3. Valida la estructura de los datos del libro.
         * 4. Crea el libro en la base de datos.
         * 5. Si la creación fue exitosa, crea las relaciones asociadas (imágenes, miembros, categorías, etc).
         * 6. Si ocurre algún error al crear relaciones, elimina el libro para evitar datos huérfanos.
         * 7. Retorna el libro creado.
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

        // Generar slug único
        if(data.saga_id){
            data.slug = await generateUniqueSlug(data.title, async (slug: string) => {
                const existingBook = await bookModel.getBySagaAndSlug(data.saga_id, slug)
                return !!existingBook
            })
        }else if(data.universe_id){
            data.slug = await generateUniqueSlug(data.title, async (slug: string) => {
                const existingBook = await bookModel.getByUniverseAndSlug(data.universe_id, slug)
                return !!existingBook
            })
        }else{
            data.slug = await generateUniqueSlug(data.title, async (slug: string) => {
                const existingBook = await bookModel.getByProjectAndSlug(project_id, slug)
                return !!existingBook
            })
        }

        const error_message = bookService.checkCreateData(data)
        if(typeof error_message == 'string') throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)

        const book = await bookModel.create(project_id, data)

        return await bookService.getById(book.id)
    },

    update: async (id:number, data: any) => {
        /**
         * Actualiza un libro existente a partir de los datos recibidos.
         * 
         * Pasos:
         * 1. Verifica que el título del libro sea único en el proyecto, universo o saga (excluyendo el libro actual).
         * 2. Genera un slug único basado en el título si ha cambiado.
         * 3. Valida la estructura de los datos del libro.
         * 4. Actualiza el libro en la base de datos.
         * 5. Retorna el libro actualizado.
         * 
         * @param {number} id - ID del libro a editar.
         * @param {any} data - Datos crudos recibidos desde el frontend.
         * 
         * @returns {IBook} - El libro actualizado correctamente.
         * 
         * @throws {CustomError} - Si hay errores de validación o duplicidad.
         */
        // Verificar que el título del libro sea único en el proyecto, universo o saga (excluyendo el libro actual)
        if(data.saga_id){
            const existingBookByTitle = await bookModel.getBySagaAndTitle(data.saga_id, data.title)
            if (existingBookByTitle && existingBookByTitle.id !== id) {
                throw new CustomError('Ya existe un libro con ese título en esta saga', 400, env.DUPLICATE_DATA_CODE)
            }
        }else if(data.universe_id){
            const existingBookByTitle = await bookModel.getByUniverseAndTitle(data.universe_id, data.title)
            if (existingBookByTitle && existingBookByTitle.id !== id) {
                throw new CustomError('Ya existe un libro con ese título en este universo', 400, env.DUPLICATE_DATA_CODE)
            }
        }else{
            const existingBookByTitle = await bookModel.getByProjectAndTitle(data.project_id, data.title)
            if (existingBookByTitle && existingBookByTitle.id !== id) {
                throw new CustomError('Ya existe un libro con ese título en este proyecto', 400, env.DUPLICATE_DATA_CODE)
            }
        }

        // Generar slug único si el título ha cambiado
        const currentBook = await bookModel.getById(id)
        if (currentBook && currentBook.title !== data.title) {
            if(data.saga_id){
                data.slug = await generateUniqueSlug(data.title, async (slug: string) => {
                    const existingBook = await bookModel.getBySagaAndSlug(data.saga_id, slug)
                    return existingBook && existingBook.id !== id
                })
            }else if(data.universe_id){
                data.slug = await generateUniqueSlug(data.title, async (slug: string) => {
                    const existingBook = await bookModel.getByUniverseAndSlug(data.universe_id, slug)
                    return existingBook && existingBook.id !== id
                })
            }else{
                data.slug = await generateUniqueSlug(data.title, async (slug: string) => {
                    const existingBook = await bookModel.getByProjectAndSlug(data.project_id, slug)
                    return existingBook && existingBook.id !== id
                })
            }
        }

        const error_message = bookService.checkUpdateData(data)
        if(typeof error_message == 'string') throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)

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

        await characterService.clearAllByBelonging(CharacterBelongingLevel.book, book_id)
        
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