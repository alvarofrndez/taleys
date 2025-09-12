import CustomError from '@/modules/customerror/CustomError'
import { IProjectMember } from './projectMember.interface'
import { projectMemberModel } from './ProjectMember'
import { env } from '@/config/config_env'
import { projectService } from '@/modules/projects/project.service'
import { userService } from '@/modules/users/user.service'
import { IProject } from '@/modules/projects/project.interface'

export const projectMemberService = {
    getAllUserProjects: async (user_id: number) => {
        /**
         * Obtiene todos los proyectos a los que pertenece un usuario.
         * 
         * Pasos:
         * 1. Llama a `projectMemberModel.getAllUserProjects()` con el `user_id`.
         * 2. Devuelve una lista de proyectos que están asociados a ese usuario en la base de datos.
         * 
         * @param {number} user_id - ID del usuario que se quiere consultar.
         * 
         * @returns {Promise<IProjectMember[]>} - Lista de proyectos asociados al usuario.
         */
        return await projectMemberModel.getAllUserProjects(user_id)
    },

    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene tados los miembros de un proyecto
         * 
         * Pasos:
         * 1. Llama a `projectMemberModel.getAllByProject()` con el `project_id`.
         * 2. Devuelve una lista de los usuarios del proyecto.
         * 
         * @param {number} project_id - ID del proyecto que se quiere consultar.
         * 
         * @returns {Promise<IProjectMember[]>} - Lista de los usaurios del proyecto.
         */
        const members = await projectMemberModel.getAllByProject(project_id)
        let final_members = []

        for(let member of members){
            final_members.push({
                ...member,
                user: await userService.getByIdDTO(member.user_id)
            })
        }

        return final_members
    },

    getAllByProjectLite: async (project_id: number) => {
        /**
         * Obtiene tados los miembros de un proyecto, con los datos simples de estos,
         * necesario para editar un proyecto
         * 
         * Pasos:
         * 1. Llama a `projectMemberModel.getAllByProject()` con el `project_id`.
         * 2. Devuelve una lista de los usuarios del proyecto.
         * 
         * @param {number} project_id - ID del proyecto que se quiere consultar.
         * 
         * @returns {Promise<IProjectMember[]>} - Lista de los usaurios del proyecto.
         */
        const members = await projectMemberModel.getAllByProject(project_id)
        let final_members = []

        for(let member of members){
            final_members.push({
                ...await userService.getByIdDTO(member.user_id),
                member_project_id: member.id
            })
        }

        return final_members
    },

    checkUserHasProjectWithSameName: async (user_id: number, project_name: string) => {
        /**
         * Verifica si un usuario ya pertenece a un proyecto con el mismo nombre que se le está intentando crear.
         * 
         * Pasos:
         * 1. Obtiene todos los proyectos en los que el usuario ya está involucrado llamando a `getAllUserProjects()`.
         * 2. Obtiene todos los proyectos con el mismo nombre llamando a `projectService.getAllByName()`.
         * 3. Compara todos los proyectos del usuario con los proyectos que tienen el mismo nombre.
         * 4. Si el usuario ya pertenece a uno de estos proyectos, retorna `true`, indicando que no se puede crear el proyecto.
         * 5. Si no, retorna `false`.
         * 
         * @param {number} user_id - ID del usuario que va a intentar crear el proyecto.
         * @param {string} project_name - Nombre del proyecto que el usuario quiere crear.
         * 
         * @returns {Promise<boolean | IProject>} - `IProject` si el usuario ya pertenece a un proyecto con el mismo nombre, de lo contrario `false`.
         */
        const all_user_projects = await projectMemberService.getAllUserProjects(user_id)
        const projects_with_same_name = await projectService.getAllByName(project_name)

        for(let user_project of all_user_projects){
            for(let project of projects_with_same_name){
                if(user_project.project_id == project.id){
                    return project
                }
            }
        }

        return false
    },

    create: async (project_id: number, project_member_data: any) => {
        /**
         * Crea una relación entre un proyecto y un miembro.
         * 
         * Pasos:
         * 1. Prepara los datos para crear un nuevo miembro del proyecto con la información recibida (`project_member_data`).
         * 2. Verifica que los datos proporcionados sean válidos llamando a `checkCreateData()`.
         * 3. Si los datos son válidos, crea la relación entre el proyecto y el miembro usando `projectMemberModel.create()`.
         * 4. Devuelve la creación exitosa del miembro del proyecto.
         * 
         * @param {number} project_id - ID del proyecto al que se va a añadir un miembro.
         * @param {any} project_member_data - Datos del miembro que se va a añadir al proyecto.
         * 
         * @returns {Promise<IProjectMember>} - La relación del miembro con el proyecto creada exitosamente.
         */
        const data_to_created: IProjectMember = {
            user_id: project_member_data.id
        }

        const error_message = projectMemberService.checkCreateData(data_to_created)
        if(typeof error_message == 'string') throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)
            
        return await projectMemberModel.create(project_id, data_to_created)
    },

    sync: async (project_id: number, project_name: string, project_members_data: any) => {
        /**
         * Sincroniza los miembros de un proyecto.
         * 
         * Pasos:
         * 1. Obtiene todos los miembros actuales asociados al proyecto usando `projectMemberService.getAllByProject`.
         * 2. Identifica:
         *    - Miembros nuevos: existen en `data.members` pero no en los actuales.
         *    - Miembros eliminados: existen en los actuales pero no en `data.members`.
         * 3. Crea los nuevos miembros usando `projectMemberService.create`, comporbando si un miembro de ellos ya
         *    está en un proyecto con el mismo nombre.
         * 4. Elimina los miembros antiguos usando `projectMemberModel.delete`.
         * 
         * @param {number} project_id - ID del proyecto al que se sincronizan los miembros.
         * @param {any[]} members - Array de miembros enviados desde el frontend.
         * 
         * @returns {Promise<void>}
         */
        const existing_members = await projectMemberService.getAllByProject(project_id)

        const existing_user_ids = new Set(existing_members.map(m => m.user_id))
        const incoming_user_ids = new Set(project_members_data.map(m => m.user_id))

        const new_members = project_members_data.filter(m => !existing_user_ids.has(m.user_id))
        const removed_members = existing_members.filter(m => !incoming_user_ids.has(m.user_id))

        for (const member of removed_members) {
            await projectMemberModel.delete(member.id)
        }

        for (const member of new_members) {
            const userId = member.user_id || member.user?.id
            const username = member.user?.username || member.username

            if (await projectMemberService.checkUserHasProjectWithSameName(userId, project_name)) {
                throw new CustomError(`El usuario ${username} ya pertenece a un proyecto con este nombre`, 400, env.DUPLICATE_DATA_CODE)
            }
            await projectMemberService.create(project_id, member)
        }
    },

    checkCreateData: (data: any) => {
        /**
         * Valida los datos necesarios para crear una relación de miembro de proyecto.
         * 
         * Pasos:
         * 1. Verifica si el `user_id` está presente en los datos proporcionados.
         * 2. Si no está presente, devuelve un mensaje de error indicando que debe indicarse el usuario a añadir.
         * 3. Si los datos son válidos, retorna `true`, indicando que se pueden crear los datos.
         * 
         * @param {any} data - Datos del miembro del proyecto que se quiere añadir.
         * 
         * @returns {string|boolean} - Un mensaje de error en caso de ser inválido, o `true` si es válido.
         */
        if(!data.user_id) return 'Debe indicar el usuario que se va a añadir como miembro'

        return true
    },

    deleteAllByProject: async (project_id: number) => {
        /**
         * Elimina todas las relaciones de miembros asociadas a un proyecto.
         * 
         * Pasos:
         * 1. Llama a `projectMemberModel.deleteAllByProject()` para eliminar todas las relaciones de miembros para el proyecto.
         * 2. Devuelve el resultado de la eliminación.
         * 
         * @param {number} project_id - ID del proyecto cuya relación de miembros se va a eliminar.
         * 
         * @returns {Promise<number>} - El número de relaciones eliminadas.
         */
        return await projectMemberModel.deleteAllByProject(project_id)
    },

    delete: async (id: number) => {
        /**
         * Elimina un miembro de un proyecto.
         * 
         * Pasos:
         * 1. Llama a `projectMemberModel.deletet()` para eliminaral miembro del proyecto.
         * 2. Devuelve el resultado de la eliminación.
         * 
         * @param {number} id - ID del miebro.
         * 
         * @returns {Promise<number>} - El número de relaciones eliminadas.
         */
        return await projectMemberModel.delete(id)
    }
}