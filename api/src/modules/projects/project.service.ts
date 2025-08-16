import { env } from '@/config/config_env'
import { projectModel } from './Project'
import { IProject } from './project.interface'
import CustomError from '@/modules/customerror/CustomError'
import { projectSiteService } from '@/modules/projectSites/projectSite.service'
import { projectVideoService } from '@/modules/projectVideos/projectVideo.service'
import { projectMemberService } from '@/modules/projectMembers/projectMember.service'
import { projectImageService } from '@/modules/projectImages/projectImage.service'
import { projectCategoryService } from '@/modules/projectCategories/projectCategory.service'
import { projectTagService } from '@/modules/projectTags/projectTag.service'
import { userService } from '@/modules/users/user.service'
import { projectCommentService } from '@/modules/projectComments/projectComment.service'
import { projectLikeService } from './projectLike.service'
import { projectSaveService } from './projectSave.service'
import { IProjectMember } from '@/modules/projectMembers/projectMember.interface'
import { IUser } from '@/modules/users/User.interface'
import { universeService } from '@/modules/universes/universe.service'
import { sagaService } from '@/modules/sagas/saga.service'

export const projectService = {
    getById: async (project_id: number, req?: any) => {
        /**
         * Obtiene un proyecto a través de su ID.
         * 
         * Pasos:
         * 1. Intenta obtener el proyecto por su ID.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {number} project_id - ID del proyecto que se desea obtener.
         * 
         * @returns {Project} El objeto `project` correspondiente al ID proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ningún proyecto con el ID dado.
        */
        let project: IProject = await projectModel.getById(project_id)

        if(!project) throw new CustomError('El proyecto no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await projectService.getAllData(project)
    },

    getByIdLite: async (project_id: number, req?: any) => {
        /**
         * Obtiene un proyecto a través de su ID.
         * 
         * Pasos:
         * 1. Intenta obtener el proyecto por su ID.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {number} project_id - ID del proyecto que se desea obtener.
         * 
         * @returns {Project} El objeto `project` correspondiente al ID proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ningún proyecto con el ID dado.
        */
        let project: IProject = await projectModel.getById(project_id)

        if(!project) throw new CustomError('El proyecto no existe', 404, env.DATA_NOT_FOUND_CODE)

        project.created_by = await userService.getByIdLite(typeof project.created_by === 'number' ||  typeof project.created_by === 'string' ? project.created_by : null)
        project.likes_count = await projectLikeService.getProyectCount(project.id)
        project.saves_count = await projectSaveService.getProyectCount(project.id)
        project.likes = await projectLikeService.getByProject(project.id)
        project.saves = await projectSaveService.getByProject(project.id)

        return project
    },

    getByIdEditData: async (project_id: number, req?: any) => {
        /**
         * Obtiene los datos de un proyecto, necesarios para editarlo a través de su ID.
         * 
         * Pasos:
         * 1. Intenta obtener el proyecto por su ID.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {number} project_id - ID del proyecto que se desea obtener.
         * 
         * @returns {Project} El objeto `project` correspondiente al ID proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ningún proyecto con el ID dado.
        */
        let project: IProject = await projectModel.getById(project_id)

        if(!project) throw new CustomError('El proyecto no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await projectService.getAllEditData(project)
    },

    getByName: async (name: string) => {
        /**
         * Obtiene un proyecto a través de su name.
         * 
         * Pasos:
         * 1. Intenta obtener el proyecto por su name.
         * 2. Si no se encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {string} name - name del proyecto que se desea obtener.
         * 
         * @returns {IProject} El objeto `project` correspondiente al name proporcionado.
         * 
         * @throws `DataNotFound` Si no se encuentra ningún proyecto con el name dado.
        */
        const project: IProject = await projectModel.getByName(name)

        if(!project) throw new CustomError('El proyecto no existe', 404, env.DATA_NOT_FOUND_CODE)

        return await projectService.getAllData(project)
    },

    getByUserAndName: async (project_name: string, user_id: number) => {
        /**
         * Obtiene un proyecto de un usuario a través de su ID y del name del proyecto.
         * 
         * Pasos:
         * 1. Intenta obtener el proyecto por el ID del usuario y el name del proyecto.
         * 2. Si no lo encuentra, lanza un error `DataNotFound`.
         * 3. Si se encuentra, lo devuelve.
         * 
         * @param {number} user_id - ID del usuario.
         * 
         * @returns {IProject} El objeto `project`.
        */
        const project: IProject = await projectMemberService.checkUserHasProjectWithSameName(user_id, project_name)

        if(!project) throw new CustomError('No perteneces al proyecto', 401, env.UNAUTHORIZED_CODE)

        return projectService.getByIdEditData(project.id)
    },

    getByUserUsernameAndName: async (project_name: string, username: string) => {
        /**
         * Obtiene un proyecto de un usuario a través del username del usuario y del name del proyecto.
         * 
         * Pasos:
         * 1. Obtiene el usuario
         * 2. Intenta obtener el proyecto por el ID del usuario y el name del proyecto.
         * 3. Si no lo encuentra, lanza un error `DataNotFound`.
         * 4. Si se encuentra, lo devuelve.
         * 
         * @param {string} project_name - nombre del proyecto.
         * @param {string} username - username del usuario.
         * 
         * @returns {IProject} El objeto `project`.
        */
        const user: IUser = await userService.getByUsername(username)

        if(!user) throw new CustomError('El usuario al que le pertenece el proyecto no existe', 404, env.DATA_NOT_FOUND_CODE)

        const project: IProject = await projectMemberService.checkUserHasProjectWithSameName(user.id, project_name)

        return projectService.getAllData(project)
    },

    getAllByUser: async (user_id: number) => {
        /**
         * Obtiene todos los proyectos de un usuario a través de su ID.
         * 
         * Pasos:
         * 1. Intenta obtener los proyectos por el ID del usuario.
         * 2. Si no se encuentren, lanza un error `DataNotFound`.
         * 3. Si se encuentren, los devuelve.
         * 
         * @param {number} user_id - ID del usuario.
         * 
         * @returns {Project[]} El array `projects` con los proyectos.
        */
        const members: IProjectMember[] = await projectMemberService.getAllUserProjects(user_id)

        let final_projects = []
        for(let member of members){
            final_projects.push(await projectService.getByIdLite(member.project_id))
        }

        return final_projects
    },

    getAllByName: async (name: string) => {
        /**
         * Obtiene todos los proyectos a través de su name.
         * 
         * Pasos:
         * 1. Intenta obtener los proyectos por el name del proyecto.
         * 2. Si no se encuentren, lanza un error `DataNotFound`.
         * 3. Si se encuentren, los devuelve.
         * 
         * @param {string} name - name del proyecto.
         * 
         * @returns {Project[]} El array `projects` con los proyectos.
        */
        const projects: IProject[] = await projectModel.getAllByName(name.toLowerCase())

        let final_projects = []
        for(let project of projects){
            final_projects.push(await projectService.getAllData(project))
        }

        return final_projects
    },

    getAllData: async (project: IProject) => {
        const project_with_all_data = {
            ...project
        }

        project_with_all_data.created_by = await userService.getById(typeof project.created_by === 'number' ||  typeof project.created_by === 'string' ? project.created_by : project.created_by.id ? project.created_by.id : null)
        project_with_all_data.likes = await projectLikeService.getByProject(project.id)
        project_with_all_data.saves = await projectSaveService.getByProject(project.id)
        project_with_all_data.members = await projectMemberService.getAllByProject(project.id)
        project_with_all_data.universes = await universeService.getAllByProject(project.id)
        return project_with_all_data
    },

    
    getAllEditData: async (project: IProject) => {
        const project_with_all_data = {
            ...project
        }

        project_with_all_data.created_by = await userService.getById(typeof project.created_by === 'number' ||  typeof project.created_by === 'string' ? project.created_by : project.created_by.id ? project.created_by.id : null)
        project_with_all_data.likes_count = await projectLikeService.getProyectCount(project.id)
        project_with_all_data.saves_count = await projectSaveService.getProyectCount(project.id)
        project_with_all_data.members = await projectMemberService.getAllByProjectLite(project.id)
        project_with_all_data.universes = await universeService.getAllByProject(project.id)
        return project_with_all_data
    },

    create: async (user_id: number, data: any) => {
        /**
         * Crea un nuevo proyecto a partir de los datos recibidos y el usuario que lo crea.
         * 
         * Pasos:
         * 1. Convierte los datos recibidos desde el `FormData` a un objeto tipado `IProject`.
         * 2. Verifica si algún miembro ya pertenece a un proyecto con el mismo nombre.
         * 3. Valida la estructura de los datos del proyecto.
         * 4. Crea el proyecto en la base de datos.
         * 5. Si la creación fue exitosa, crea las relaciones asociadas (imágenes, miembros, categorías, etc).
         * 6. Si ocurre algún error al crear relaciones, elimina el proyecto para evitar datos huérfanos.
         * 7. Retorna el proyecto creado.
         * 
         * @param {number} user_id - ID del usuario que está creando el proyecto.
         * @param {any} data - Datos crudos recibidos desde el frontend (ej. FormData).
         * 
         * @returns {Project} - El proyecto creado correctamente.
         * 
         * @throws {CustomError} - Si hay errores de validación o duplicidad.
         */
        for(let member of data.members){
            if(await projectMemberService.checkUserHasProjectWithSameName(member.id, data.name)) throw new CustomError(`El usuario ${member.username} ya pertenece a un proyecto con este nombre`, 400, env.DUPLICATE_DATA_CODE)
        }

        const error_message = projectService.checkCreateData(data)
        if(typeof error_message == 'string') throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)

        const project = await projectModel.create(user_id, data)

        if(project){
            try{
                for(let m of data.members){
                    await projectMemberService.create(project.id, m)
                }
            }catch(error){
                await projectService.delete(project.id)
                throw new CustomError(error.message, error.status_code, error.error_code)
            }

        }else{
            throw new CustomError('Ha ocurrido un error al crear el proyecto')
        }

        return project
    },

    update: async (id:number, user_id: number, data: any) => {
        /**
         * Actualiza un nuevo proyecto a partir de los datos recibidos y el usuario que lo crea.
         * 
         * Pasos:
         * 1. Convierte los datos recibidos desde el `FormData` a un objeto tipado `IProject`.
         * 2. Verifica si algún miembro ya pertenece a un proyecto con el mismo nombre.
         * 3. Valida la estructura de los datos del proyecto.
         * 4. Crea el proyecto en la base de datos.
         * 5. Si la creación fue exitosa, crea las relaciones asociadas (imágenes, miembros, categorías, etc).
         * 6. Si ocurre algún error al crear relaciones, elimina el proyecto para evitar datos huérfanos.
         * 7. Retorna el proyecto creado.
         * 
         * @param {number} user_id - ID del usuario que está creando el proyecto.
         * @param {any} data - Datos crudos recibidos desde el frontend (ej. FormData).
         * 
         * @returns {Project} - El proyecto creado correctamente.
         * 
         * @throws {CustomError} - Si hay errores de validación o duplicidad.
         */
        const error_message = projectService.checkUpdateData(data)
        if(typeof error_message == 'string') throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)

        const row_counts = await projectModel.update(id, user_id, data)

        if(row_counts && row_counts > 0){
            try{
                await projectMemberService.sync(id, data.name, data.members)
            }catch(error){
                throw new CustomError(error.message, error.status_code, error.error_code)
            }

        }else{
            throw new CustomError('Ha ocurrido un error al actializar el proyecto')
        }

        return await projectService.getById(id)
    },

    convertFormData: (data: any) => {
        /**
         * Convierte los datos recibidos en formato `FormData` a un objeto de tipo `IProject`.
         * 
         * Pasos:
         * 1. Convierte las propiedades específicas (`categories`, `tags`, `videos`, `members`, `sites`)
         *    desde su formato string (JSON) a objetos.
         * 2. Si alguna de estas propiedades no está presente, se asigna como array vacío.
         * 3. Recorre el resto de claves del objeto:
         *    - Convierte `permit_comments` y `atribution` de string a booleano.
         *    - Para la propiedad `images`, transforma cada archivo a un objeto con sus metadatos.
         *    - El resto de propiedades se asignan directamente.
         * 
         * @param {any} data - Datos recibidos en formato `FormData`, típicamente de una petición multipart/form-data.
         * 
         * @returns {IProject} Objeto del tipo `IProject` con todos los datos convertidos correctamente.
         */
        const converted_data: IProject = {}

        const keysToParse = ['categories', 'tags', 'videos', 'members', 'sites']

        keysToParse.forEach(key => {
            if (data[key]) {
                converted_data[key] = data[key].map((item: any) => {
                    try {
                        return JSON.parse(item)
                    } catch {
                        return item
                    }
                })
            } else {
                converted_data[key] = []
            }
        })

        Object.keys(data).forEach((key) => {
            if (converted_data[key] !== undefined) return

            let value = data[key]

            if (key === 'permit_comments' || key === 'atribution') {
                converted_data[key] = value === 'true'
                    ? true
                    : value === 'false'
                    ? false
                    : value
            } else if (key === 'images') {
                const images: any[] = Array.isArray(value) ? value : [value]

                converted_data[key] = images.map((img: any) => {
                    if (img.buffer) {
                        return {
                            originalname: img.originalname,
                            encoding: img.encoding,
                            mimetype: img.mimetype,
                            buffer: img.buffer,
                            size: img.size,
                        }
                    } else {
                        try {
                            const parsed = typeof img === 'string' ? JSON.parse(img) : img
                            return parsed
                        } catch (err) {
                            console.warn('Imagen no válida en FormData:', img)
                            return null
                        }
                    }
                }).filter(Boolean)
            } else {
                converted_data[key] = value
            }
        })

        return converted_data
    },

    checkCreateData: (data: any) => {
        /**
         * Valida los campos requeridos para la creación de un proyecto.
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
         * @param {Object} data - Datos del proyecto a validar.
         * @param {string} data.name - Nombre del proyecto.
         * @param {string} data.description - Descripción del proyecto.
         * @param {Array} data.members - Descripción del proyecto.
         * @param {string} data.visibility - Visibilidad del proyecto ('public' o 'private').
         * 
         * @returns {true|string} - `true` si todos los campos son válidos, o un mensaje de error en caso contrario.
        */

        if(!data.name || !data.name.trim()) return 'El nombre no puede estar vacío'
        if(data.name.length < 2) return 'El nombre debe tener dos caracteres mínimo'
        if(!data.description || !data.description.trim()) return 'El proyecto debe incluir una descripción'
        if(data.members.length === 0) return 'El projecto debe incluir mínimo un miembro'
        if (!['public', 'private'].includes(data.visibility)) {
            return `La visibilidad del proyecto debe ser 'public' o 'private'`
        }

        return true
    },

    checkUpdateData: (data: any) => {
        /**
         * Valida los campos requeridos para la edición de un proyecto.
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
         * @param {Object} data - Datos del proyecto a validar.
         * @param {string} data.name - Nombre del proyecto.
         * @param {string} data.description - Descripción del proyecto.
         * @param {Array} data.categories - Categorías asociadas al proyecto.
         * @param {Array} data.images - Imágenes del proyecto.
         * @param {Array} data.sites - Enlaces relacionados al proyecto, con proveedor.
         * @param {Array} data.videos - Enlaces de videos del proyecto.
         * @param {Array} data.members - Descripción del proyecto.
         * @param {string} data.visibility - Visibilidad del proyecto ('public' o 'private').
         * 
         * @returns {true|string} - `true` si todos los campos son válidos, o un mensaje de error en caso contrario.
        */

        if(!data.name || !data.name.trim()) return 'El nombre no puede estar vacío'
        if(data.name.length < 2) return 'El nombre debe tener dos caracteres mínimo'
        if(!data.description || !data.description.trim()) return 'El proyecto debe incluir una descripción'
        if(data.members.length === 0) return 'El projecto debe incluir mínimo un miembro'
    
        if (!['public', 'private'].includes(data.visibility)) {
            return `La visibilidad del proyecto debe ser 'public' o 'private'`
        }

        return true
    },

    delete: async (project_id: number) => {
        /**
         * Elimina un proyecto y todas sus relaciones asociadas.
         * 
         * Pasos:
         * 1. Verifica si el proyecto existe.
         * 2. Elimina los universos asociados al proyecto.
         * 3. Elimina los saga asociados al proyecto.
         * 4. Elimina el proyecto.
         * 
         * @param {number} project_id - ID del proyecto a eliminar.
         * 
         * @returns {boolean} `true` si el proyecto fue eliminado correctamente.
         * 
         * @throws {CustomError} Si el proyecto no existe.
         */
        const project = await projectService.getById(project_id)
        if(!project) throw new CustomError('El proyecto no existe', 404, env.DATA_NOT_FOUND_CODE)

        await projectMemberService.deleteAllByProject(project_id)
        await universeService.deleteAllByProject(project_id)
        await sagaService.deleteAllByProject(project_id)

        return await projectModel.delete(project_id)
    }
}