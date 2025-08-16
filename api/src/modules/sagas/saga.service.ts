import { env } from '@/config/config_env'
import { sagaModel } from './Saga'
import { ISaga } from './saga.interface'
import CustomError from '@/modules/customerror/CustomError'
import { universeService } from '../universes/universe.service'

export const sagaService = {
    getById: async (saga_id: number) => {
        /**
         * Obtiene una saga a través de su ID.
         * 
         * Pasos:
         * 1. Intenta obtener la saga por su ID.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {number} saga_id - ID de la saga que se desea obtener.
         * 
         * @returns {ISaga} El objeto `saga` correspondiente al ID proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ningún saga con el ID dado.
        */
        let saga: ISaga = await sagaModel.getById(saga_id)

        if(!saga) throw new CustomError('La saga no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await sagaService.getAllData(saga)
    },

    getByIdLite: async (saga_id: number) => {
        /**
         * Obtiene una saga a través de su ID.
         * 
         * Pasos:
         * 1. Intenta obtener la saga por su ID.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {number} saga_id - ID de la saga que se desea obtener.
         * 
         * @returns {ISaga} El objeto `saga` correspondiente al ID proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ningún saga con el ID dado.
        */
        let saga: ISaga = await sagaModel.getById(saga_id)

        if(!saga) throw new CustomError('La saga no existe', 404, env.DATA_NOT_FOUND_CODE)

        return saga
    },

    getByIdEditData: async (saga_id: number) => {
        /**
         * Obtiene los datos de una saga, necesarios para editarlo a través de su ID.
         * 
         * Pasos:
         * 1. Intenta obtener la saga por su ID.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {number} project_id - ID del saga que se desea obtener.
         * 
         * @returns {ISaga} El objeto `saga` correspondiente al ID proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ninguna saga con el ID dado.
        */
        let saga: ISaga = await sagaModel.getById(saga_id)

        if(!saga) throw new CustomError('La saga no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await sagaService.getAllEditData(saga)
    },

    getByUniverseAndName: async (universe_id: number, name: string) => {
        /**
         * Obtiene una saga de un universo a través de su name.
         * 
         * Pasos:
         * 1. Intenta obtener la saga por su name.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {number} universe_id - id del universo al que pertenece la saga.
         * 
         * @param {string} name - name de la saga que se desea obtener.
         * 
         * @returns {ISaga} El objeto `saga` correspondiente al name proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ninguna saga con el name dado.
        */
        const saga: ISaga = await sagaModel.getByUniverseAndName(universe_id, name)

        if(!saga) throw new CustomError('La saga no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await sagaService.getAllData(saga)
    },

    getByProjectAndName: async (project_id: number, name: string) => {
        /**
         * Obtiene una saga de un projecto a través de su name.
         * 
         * Pasos:
         * 1. Intenta obtener la saga por su name.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {number} project_id - id del proyecto al que pertenece la saga.
         * 
         * @param {string} name - name de la saga que se desea obtener.
         * 
         * @returns {ISaga} El objeto `saga` correspondiente al name proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ninguna saga con el name dado.
        */
        const saga: ISaga = await sagaModel.getByProjectAndName(project_id, name)

        if(!saga) throw new CustomError('La saga no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await sagaService.getAllData(saga)
    },

    getByProjectAndUniverseNameAndName: async (project_id: number, universe_name: string,  name: string) => {
        /**
         * Obtiene una saga de un projecto a través de su name y del name del universo.
         * 
         * Pasos:
         * 1. Intenta obtener el universo por su name y el id del proyecto.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, intenta obtener la saga por el id del universo y su name.
         * 4. Si no se encuentra, lanza un error `DataNotFound`.
         * 2. Si se encuentra, lo devuelve.
         * 
         * @param {number} project_id - id del proyecto al que pertenece la saga.
         * 
         * @param {string} universe_name - name del universo al que pertenece la saga.
         * 
         * @param {string} name - name de la saga que se desea obtener.
         * 
         * @returns {ISaga} El objeto `saga` correspondiente al name proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ningún universo o saga con los names dados.
        */
        const universe = await universeService.getByName(project_id, universe_name)

        const saga: ISaga = await sagaModel.getByUniverseAndName(universe.id, name)

        if(!saga) throw new CustomError('La saga no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await sagaService.getAllData(saga)
    },

    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene todos los sagas a través de un proyecto.
         * 
         * Pasos:
         * 1. Intenta obtener los sagas por id del proyecto.
         * 2. Si no se encuentren, lanza un error `DataNotFound`.
         * 3. Si se encuentren, los devuelve.
         * 
         * @param {number} project_id - project_id del proyecto.
         * 
         * @returns {ISaga[]} El array `sagas` con los sagas.
        */
        const sagas: ISaga[] = await sagaModel.getAllByProject(project_id)

        let final_sagas = []
        for(let saga of sagas){
            final_sagas.push(await sagaService.getAllData(saga))
        }

        return final_sagas
    },

    getAllByUniverse: async (unvierse_id: number) => {
        /**
         * Obtiene todos los sagas a través de un universo.
         * 
         * Pasos:
         * 1. Intenta obtener los sagas por id del universo.
         * 2. Si no se encuentren, lanza un error `DataNotFound`.
         * 3. Si se encuentren, los devuelve.
         * 
         * @param {number} unvierse_id - unvierse_id del universo.
         * 
         * @returns {ISaga[]} El array `sagas` con los sagas.
        */
        const sagas: ISaga[] = await sagaModel.getAllByUniverse(unvierse_id)

        let final_sagas = []
        for(let saga of sagas){
            final_sagas.push(await sagaService.getAllData(saga))
        }

        return final_sagas
    },

    getAllData: async (saga: ISaga) => {
        const saga_with_all_data = {
            ...saga
        }

        if(saga_with_all_data.universe_id != null && (typeof saga_with_all_data.universe_id === 'number' || typeof saga_with_all_data.universe_id === 'string')){
            saga_with_all_data.universe = await universeService.getByIdLite(saga_with_all_data.universe_id)
        }

        if(saga_with_all_data.parent_saga_id != null && (typeof saga_with_all_data.parent_saga_id === 'number' || typeof saga_with_all_data.parent_saga_id === 'string')){
            saga_with_all_data.parent_saga = await sagaService.getById(saga_with_all_data.parent_saga_id)
        }

        return saga_with_all_data
    },

    
    getAllEditData: async (saga: ISaga) => {
        const saga_with_all_data = {
            ...saga
        }

        return saga_with_all_data
    },

    create: async (project_id: number, data: any) => {
        /**
         * Crea un nuevo saga a partir de los datos recibidos y el proyecto al que pertenece.
         * 
         * Pasos:
         * 1. Verifica si ya existia una saga con ese nombre en el proyecto.
         * 2. Valida la estructura de los datos de la saga.
         * 3. Crea la saga en la base de datos.
         * 4. Si la creación fue exitosa, crea las relaciones asociadas (imágenes, miembros, categorías, etc).
         * 5. Si ocurre algún error al crear relaciones, elimina la saga para evitar datos huérfanos.
         * 6. Retorna la saga creado.
         * 
         * @param {number} project_id - ID del proyecto al que pertenece la saga.
         * @param {any} data - Datos crudos recibidos desde el frontend.
         * 
         * @returns {ISaga} - La saga creado correctamente.
         * 
         * @throws {CustomError} - Si hay errores de validación o duplicidad.
         */
        if(data.universe_id){
            if(await sagaService.checkUniverseHasSagaWithSameName(data.universe_id, data.name)) throw new CustomError(`Ya existe una saga con ese nombre en este universo`, 400, env.DUPLICATE_DATA_CODE)
        }else{
            if(await sagaService.checkProjectHasSagaWithSameName(project_id, data.name)) throw new CustomError(`Ya existe una saga con ese nombre en este proyecto`, 400, env.DUPLICATE_DATA_CODE)
        }

        const error_message = sagaService.checkCreateData(data)
        if(typeof error_message == 'string') throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)

        const saga = await sagaModel.create(project_id, data)

        return await sagaService.getById(saga.id)
    },

    update: async (id:number, data: any) => {
        /**
         * Actualiza un nuevo saga a partir de los datos recibidos.
         * 
         * Pasos:
         * 1. Valida la estructura de los datos de la saga.
         * 2. Actualiza la saga en la base de datos.
         * 3. Retorna la saga creado.
         * 
         * @param {number} id - ID de la saga a editar.
         * @param {any} data - Datos crudos recibidos desde el frontend.
         * 
         * @returns {ISaga} - La saga actualizdo correctamente.
         * 
         * @throws {CustomError} - Si hay errores de validación o duplicidad.
         */
        const error_message = sagaService.checkUpdateData(data)
        if(typeof error_message == 'string') throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)

        let saga_exists = undefined 

        if(data.universe_id){
            saga_exists = await sagaService.getByUniverseAndName(data.universe_id, data.name)
        }else{
            saga_exists = await sagaService.getByProjectAndName(data.project_id, data.name)
        }

        if(saga_exists && saga_exists.id != data.id) throw new CustomError('Ya existe una saga con este nombre', 400, env.DUPLICATE_DATA_CODE)

        const saga = await sagaModel.update(id, data)

        return await sagaService.getById(id)
    },

    checkCreateData: (data: any) => {
        /**
         * Valida los campos requeridos para la creación de una saga.
         * 
         * Esta función comprueba que todos los campos necesarios estén presentes y cumplan con ciertas reglas de formato y contenido:
         * 
         * - El nombre no puede estar vacío ni tener menos de 2 caracteres.
         * - La descripción no puede estar vacía.
         * - Debe pertenecer a una saga.
         * 
         * @param {Object} data - Datos de la saga a validar.
         * @param {string} data.name - Nombre de la saga.
         * @param {string} data.description - Descripción de la saga.
         * 
         * @returns {true|string} - `true` si todos los campos son válidos, o un mensaje de error en caso contrario.
        */

        if(!data.name || !data.name.trim()) return 'El nombre no puede estar vacío'
        if(data.name.length < 2) return 'El nombre debe tener dos caracteres mínimo'
        if(!data.description || !data.description.trim()) return 'La saga debe incluir una descripción'

        return true
    },

    checkUpdateData: (data: any) => {
        /**
         * Valida los campos requeridos para la edición de una saga.
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
         * @param {Object} data - Datos de la saga a validar.
         * @param {string} data.name - Nombre de la saga.
         * @param {string} data.description - Descripción de la saga.
         * 
         * @returns {true|string} - `true` si todos los campos son válidos, o un mensaje de error en caso contrario.
        */

        if(!data.name || !data.name.trim()) return 'El nombre no puede estar vacío'
        if(data.name.length < 2) return 'El nombre debe tener dos caracteres mínimo'
        if(!data.description || !data.description.trim()) return 'La saga debe incluir una descripción'

        return true
    },

    checkProjectHasSagaWithSameName: async (project_id: number, name: string) => {
        /**
        * Devuelve la saga que coincide en el name

        * @param {number} project_id - Id del proyecto.
        * @param {string} name - Nombre de la saga.
        * 
        * @returns {ISaga} -Objeto saga.
        */
        return await sagaModel.getByProjectAndName(project_id, name)
    },

    checkUniverseHasSagaWithSameName: async (universe_id: number, name: string) => {
        /**
        * Devuelve la saga que coincide en el name
        * @param {number} universe_id - Id del universo.
        * @param {string} name - Nombre de la saga.
        * 
        * @returns {ISaga} -Objeto saga.
        */
        return await sagaModel.getByUniverseAndName(universe_id, name)
    },

    delete: async (saga_id: number) => {
        /**
         * Elimina una saga y todas sus relaciones asociadas.
         * 
         * Pasos:
         * 1. Verifica si la saga existe.
         * 2. Elimina las sagas hijas.
         * 3. ELimina los libros asociados a la saga.
         * 3. ELimina los eventos asociados a la saga.
         * 3. ELimina los personajes asociados a la saga.
         * 3. ELimina los lugares asociados a la saga.
         * 
         * @param {number} saga_id - ID de la saga a eliminar.
         * 
         * @returns {boolean} `true` si la saga fue eliminado correctamente.
         * 
         * @throws {CustomError} Si la saga no existe.
         */
        const saga = await sagaService.getById(saga_id)
        if(!saga) throw new CustomError('La saga no existe', 404, env.DATA_NOT_FOUND_CODE)

        await sagaService.deleteAllSagaChilds(saga_id)

        return await sagaModel.delete(saga_id)
    },

    deleteAllSagaChilds: async (saga_id: number) => {
        /**
         * Elimina todas las sagas hijas de una saga.
         * 
         * Pasos:
         * 1. Obtiene todas las sagas hijas.
         * 2. Elimina una por una cada saga hija, llamando al metodo `sagaService.delete(saga_id)`,
         *    haciendo que sea una llamada recursiva hasta eliminar todo el árbol de sagas.
         * 
         * @param {number} saga_id - ID de la saga a eliminar.
         * 
         * @returns {boolean} `true` si la saga fue eliminado correctamente.
         * 
         * @throws {CustomError} Si la saga no existe.
         */
        const sagas = await sagaModel.getAllSagaChilds(saga_id)

        for (const saga of sagas) {
            await sagaService.delete(saga.id)
        }
    },

    deleteAllByUniverse: async (universe_id: number) => {
        /**
         * Elimina todas las sagas pertenecientes a un universo.
         * 
         * @param {number} universe_id - ID del universo al que pertenecen las sagas.
         */
        const sagas = await sagaService.getAllByUniverse(universe_id)

        for (const saga of sagas) {
            await sagaService.delete(saga.id)
        }
    },

    deleteAllByProject: async (project_id: number) => {
        /**
         * Elimina todas las sagas pertenecientes a un proyecto.
         * 
         * @param {number} project_id - ID del proyecto al que pertenecen las sagas.
         */
        const sagas = await sagaService.getAllByProject(project_id)

        for (const saga of sagas) {
            await sagaService.delete(saga.id)
        }
    },
}