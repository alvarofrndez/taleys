import { env } from '@/config/config_env'
import { universeModel } from './Universe'
import { IUniverse } from './universe.interface'
import CustomError from '@/modules/customerror/CustomError'
import { sagaService } from '@/modules/sagas/saga.service'
import { bookService } from '@/modules/books/book.service'
import { generateUniqueSlug } from '@/utils/slugify/generateUniqueSlug'
import { characterService } from '@/modules/characters/character.service'
import { CharacterBelongingLevel } from '@/modules/characters/character.interface'

export const universeService = {
    getById: async (universe_id: number) => {
        /**
         * Obtiene un universo a través de su ID.
         * 
         * Pasos:
         * 1. Intenta obtener el universo por su ID.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {number} universe_id - ID del universo que se desea obtener.
         * 
         * @returns {IUniverse} El objeto `universe` correspondiente al ID proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ningún universo con el ID dado.
        */
        let universe: IUniverse = await universeModel.getById(universe_id)

        if(!universe) throw new CustomError('El universo no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await universeService.getAllData(universe)
    },

    getByIdLite: async (universe_id: number) => {
        /**
         * Obtiene un universo a través de su ID.
         * 
         * Pasos:
         * 1. Intenta obtener el universo por su ID.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {number} universe_id - ID del universo que se desea obtener.
         * 
         * @returns {IUniverse} El objeto `universe` correspondiente al ID proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ningún universo con el ID dado.
        */
        let universe: IUniverse = await universeModel.getById(universe_id)

        if(!universe) throw new CustomError('El universo no existe', 404, env.DATA_NOT_FOUND_CODE)

        return universe
    },

    getByIdEditData: async (universe_id: number) => {
        /**
         * Obtiene los datos de un unvierso, necesarios para editarlo a través de su ID.
         * 
         * Pasos:
         * 1. Intenta obtener el unvierso por su ID.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {number} project_id - ID del unvierso que se desea obtener.
         * 
         * @returns {IUniverse} El objeto `universe` correspondiente al ID proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ningún unvierso con el ID dado.
        */
        let universe: IUniverse = await universeModel.getById(universe_id)

        if(!universe) throw new CustomError('El unvierso no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await universeService.getAllEditData(universe)
    },

    getByName: async (project_id: number, name: string) => {
        /**
         * Obtiene un universo de un projecto a través de su name.
         * 
         * Pasos:
         * 1. Intenta obtener el universo por su name.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {number} project_id - id del proyecto al que pertenece el universo.
         * 
         * @param {string} name - name del universo que se desea obtener.
         * 
         * @returns {IUniverse} El objeto `universe` correspondiente al name proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ningún proyecto con el name dado.
        */
        const universe: IUniverse = await universeModel.getByName(project_id, name)

        if(!universe) throw new CustomError('El universo no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await universeService.getAllData(universe)
    },

    getBySlug: async (project_id: number, slug: string) => {
        const universe: IUniverse = await universeModel.getBySlug(project_id, slug)

        if(!universe) throw new CustomError('El universo no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await universeService.getAllData(universe)
    },

    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene todos los universos a través de un proyecto.
         * 
         * Pasos:
         * 1. Intenta obtener los universos por id del proyecto.
         * 2. Si no se encuentren, lanza un error `DataNotFound`.
         * 3. Si se encuentren, los devuelve.
         * 
         * @param {number} project_id - project_id del proyecto.
         * 
         * @returns {IUniverse[]} El array `universos` con los universos.
        */
        const universes: IUniverse[] = await universeModel.getAllByProject(project_id)

        let final_universes = []
        for(let universe of universes){
            final_universes.push(await universeService.getAllData(universe))
        }

        return final_universes
    },

    getAllUniverseChilds: async (project_id: number) => {
        /**
         * Obtiene todos los universos pertenecientes a otro universo.
         * 
         * Pasos:
         * 1. Intenta obtener los universos por id del universo.
         * 2. Si no se encuentren, lanza un error `DataNotFound`.
         * 3. Si se encuentren, los devuelve.
         * 
         * @param {number} project_id - project_id del proyecto.
         * 
         * @returns {IUniverse[]} El array `universos` con los universos.
        */
        const universes: IUniverse[] = await universeModel.getAllUniverseChilds(project_id)

        let final_universes = []
        for(let universe of universes){
            final_universes.push(await universeService.getAllData(universe))
        }

        return final_universes
    },

    getAllData: async (universe: IUniverse) => {
        const universe_with_all_data = {
            ...universe
        }

        if(universe_with_all_data.parent_universe_id != null && (typeof universe_with_all_data.parent_universe_id === 'number' || typeof universe_with_all_data.parent_universe_id === 'string')){
            universe_with_all_data.parent_universe = await universeService.getById(universe_with_all_data.parent_universe_id)
        }
        universe_with_all_data.universes = await universeService.getAllUniverseChilds(universe.id)
        universe_with_all_data.sagas = await sagaService.getAllByUniverse(universe.id)
        universe_with_all_data.books = await bookService.getAllByUniverse(universe.id)
        universe_with_all_data.characters = await characterService.listByBelonging('universe', universe.id)

        return universe_with_all_data
    },

    
    getAllEditData: async (universe: IUniverse) => {
        const universe_with_all_data = {
            ...universe
        }

        return universe_with_all_data
    },

    create: async (project_id: number, data: any) => {
        /**
         * Crea un nuevo universo a partir de los datos recibidos y el proyecto al que pertenece.
         * 
         * Pasos:
         * 1. Verifica si ya existia un universo con ese nombre en el proyecto.
         * 2. Genera un slug único basado en el nombre.
         * 3. Valida la estructura de los datos del universo.
         * 4. Crea el universo en la base de datos.
         * 5. Si la creación fue exitosa, crea las relaciones asociadas (imágenes, miembros, categorías, etc).
         * 6. Si ocurre algún error al crear relaciones, elimina el universo para evitar datos huérfanos.
         * 7. Retorna el universo creado.
         * 
         * @param {number} project_id - ID del proyecto al que pertenece el universo.
         * @param {any} data - Datos crudos recibidos desde el frontend.
         * 
         * @returns {IUniverse} - El universo creado correctamente.
         * 
         * @throws {CustomError} - Si hay errores de validación o duplicidad.
         */
        if(await universeService.checkProjectHasUniverseWithSameName(project_id, data.name)) throw new CustomError(`Ya existe un universo con ese nombre en este proyecto`, 400, env.DUPLICATE_DATA_CODE)

        // Generar slug único
        data.slug = await generateUniqueSlug(data.name, async (slug: string) => {
            const existingUniverse = await universeModel.getBySlug(project_id, slug)
            return !!existingUniverse
        })

        const error_message = universeService.checkCreateData(data)
        if(typeof error_message == 'string') throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)

        const universe = await universeModel.create(project_id, data)

        return universe
    },

    update: async (id:number, data: any) => {
        /**
         * Actualiza un universo existente a partir de los datos recibidos.
         * 
         * Pasos:
         * 1. Verifica que el nombre del universo sea único en el proyecto (excluyendo el universo actual).
         * 2. Genera un slug único basado en el nombre si ha cambiado.
         * 3. Valida la estructura de los datos del universo.
         * 4. Actualiza el universo en la base de datos.
         * 5. Retorna el universo actualizado.
         * 
         * @param {number} id - ID del universo a editar.
         * @param {any} data - Datos crudos recibidos desde el frontend.
         * 
         * @returns {IUniverse} - El universo actualizado correctamente.
         * 
         * @throws {CustomError} - Si hay errores de validación o duplicidad.
         */
        // Verificar que el nombre del universo sea único en el proyecto (excluyendo el universo actual)
        const existingUniverseByName = await universeModel.getByName(data.project_id, data.name)
        if (existingUniverseByName && existingUniverseByName.id !== id) {
            throw new CustomError('Ya existe un universo con ese nombre en este proyecto', 400, env.DUPLICATE_DATA_CODE)
        }

        // Generar slug único si el nombre ha cambiado
        const currentUniverse = await universeModel.getById(id)
        if (currentUniverse && currentUniverse.name !== data.name) {
            data.slug = await generateUniqueSlug(data.name, async (slug: string) => {
                const existingUniverse = await universeModel.getBySlug(data.project_id, slug)
                return existingUniverse && existingUniverse.id !== id
            })
        }

        const error_message = universeService.checkUpdateData(data)
        if(typeof error_message == 'string') throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)

        const universe = await universeModel.update(id, data)

        return await universeService.getById(id)
    },

    checkCreateData: (data: any) => {
        /**
         * Valida los campos requeridos para la creación de un universo.
         * 
         * Esta función comprueba que todos los campos necesarios estén presentes y cumplan con ciertas reglas de formato y contenido:
         * 
         * - El nombre no puede estar vacío ni tener menos de 2 caracteres.
         * - La descripción no puede estar vacía.
         * - Debe pertenecer a un universo.
         * 
         * @param {Object} data - Datos del universo a validar.
         * @param {string} data.name - Nombre del universo.
         * @param {string} data.description - Descripción del universo.
         * 
         * @returns {true|string} - `true` si todos los campos son válidos, o un mensaje de error en caso contrario.
        */

        if(!data.name || !data.name.trim()) return 'El nombre no puede estar vacío'
        if(data.name.length < 2) return 'El nombre debe tener dos caracteres mínimo'
        if(!data.description || !data.description.trim()) return 'El universo debe incluir una descripción'

        return true
    },

    checkUpdateData: (data: any) => {
        /**
         * Valida los campos requeridos para la edición de un universo.
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
         * @param {Object} data - Datos del universo a validar.
         * @param {string} data.name - Nombre del universo.
         * @param {string} data.description - Descripción del universo.
         * 
         * @returns {true|string} - `true` si todos los campos son válidos, o un mensaje de error en caso contrario.
        */

        if(!data.name || !data.name.trim()) return 'El nombre no puede estar vacío'
        if(data.name.length < 2) return 'El nombre debe tener dos caracteres mínimo'
        if(!data.description || !data.description.trim()) return 'El universo debe incluir una descripción'

        return true
    },

    checkProjectHasUniverseWithSameName: async (project_id: number, name: string) => {
        return await universeModel.getByName(project_id, name)
    },

    delete: async (universe_id: number) => {
        /**
         * Elimina un universo y todas sus relaciones asociadas.
         * 
         * Pasos:
         * 1. Verifica si el universo existe.
         * 2. Elimina todas las imágenes asociadas al universo.
         * 3. Elimina todos los miembros del universo.
         * 4. Elimina las categorías del universo.
         * 5. Elimina las etiquetas (tags) del universo.
         * 6. Elimina los sitios asociados al universo.
         * 7. Elimina los vídeos asociados al universo.
         * 8. Elimina el propio universo de la base de datos.
         * 
         * @param {number} universe_id - ID del universo a eliminar.
         * 
         * @returns {boolean} `true` si el universo fue eliminado correctamente.
         * 
         * @throws {CustomError} Si el universo no existe.
         */
        const universe = await universeService.getById(universe_id)
        if(!universe) throw new CustomError('El proyecto no existe', 404, env.DATA_NOT_FOUND_CODE)

        await universeService.deleteAllUniverseChilds(universe_id)
        await sagaService.deleteAllByUniverse(universe_id)
        await bookService.deleteAllByUniverse(universe_id)
        await characterService.clearAllByBelonging(CharacterBelongingLevel.universe, universe_id)

        return await universeModel.delete(universe_id)
    },

    deleteAllByProject: async (project_id: number) => {
        /**
         * Elimina todos los universos y todas sus relaciones asociadas de un proyecto.
         * 
         * Pasos:
         * 1. Obtiene todos los universos.
         * 2. Elimina uno por uno los universos.
         * 
         * @param {number} project_id - ID del universo a eliminar.
         */
        const universes = await universeService.getAllByProject(project_id)

        for(let universe of universes) {
            await universeService.delete(universe.id)
        }
    }, 

    deleteAllUniverseChilds: async (universe_id: number) => {
        /**
         * Elimina todos los universos hijos de un universo.
         * 
         * Pasos:
         * 1. Obtiene todos los universos hijos.
         * 2. Elimina uno por uno cada universo hijo, llamando al metodo `universeService.delete(universe_id)`,
         *    haciendo que sea una llamada recursiva hasta eliminar todo el árbol de universos.
         * 
         * @param {number} universe_id - ID del universo a eliminar.
         */
        const universes = await universeModel.getAllUniverseChilds(universe_id)

        for(let universe of universes){
            await universeService.delete(universe.id)
        }
    },
}