import { IProjectSite } from './projectSite.interface'
import { projectSiteModel } from './ProjecSite'
import { env } from '@/config/config_env'
import CustomError from '@/modules/customerror/CustomError'
import { projectSiteProviderService } from '@/modules/projectSiteProviders/projectSiteProvider.service'

export const projectSiteService = {
    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene todos los sitios de un proyecto
         * 
         * Pasos:
         * 1. Llama a `projectSiteModel.getAllByProject()` con el `project_id` para obtener todos los sitios
         * del proyecto.
         * 2. Por cada categoria llama a `projectSiteProviderService.getById()` con el `site.provider_id` para obtener los datos
         * de la categoría
         * 3. Devuelve una lista de los sitios del proyecto.
         * 
         * @param {number} project_id - ID del proyecto que se quiere consultar.
         * 
         * @returns {Promise<IProjectSite[]>} - Lista de los sitios del proyecto.
         */
        const sites = await projectSiteModel.getAllByProject(project_id)
        let final_sites = []

        for(let site of sites){
            final_sites.push({
                ...site,
                provider: await projectSiteProviderService.getById(site.provider_id)
            })
        }

        return final_sites
    },

    getAllByProjectLite: async (project_id: number) => {
        /**
         * Obtiene todos los sitios de un proyecto, con los datos simples de estos,
         * necesario para editar un proyecto
         * 
         * Pasos:
         * 1. Llama a `projectSiteModel.getAllByProject()` con el `project_id` para obtener todos los sitios
         * del proyecto.
         * 2. Por cada categoria llama a `projectSiteProviderService.getById()` con el `site.provider_id` para obtener los datos
         * de la categoría
         * 3. Devuelve una lista de los sitios del proyecto.
         * 
         * @param {number} project_id - ID del proyecto que se quiere consultar.
         * 
         * @returns {Promise<IProjectSite[]>} - Lista de los sitios del proyecto.
         */
        const sites = await projectSiteModel.getAllByProject(project_id)
        let final_sites = []

        for(let site of sites){
            final_sites.push({
                ...await projectSiteProviderService.getById(site.provider_id),
                site_project_id: site.id
            })
        }

        return final_sites
    },

    create: async (project_id: number, project_site_data: any) => {
        /**
         * Crea una nueva relación entre un proyecto y un sitio web.
         * 
         * Pasos:
         * 1. Se toma la información del sitio proporcionado, específicamente la URL y el proveedor asociado al sitio.
         * 2. Se valida la información mediante la función `checkCreateData` para asegurarse de que los datos sean correctos.
         * 3. Si los datos son válidos, se inserta la relación en la base de datos utilizando el modelo `projectSiteModel.create`.
         * 4. Si todo es exitoso, se retorna la relación recién creada entre el proyecto y el sitio.
         * 
         * @param {number} project_id - ID del proyecto al que se va a asociar el sitio.
         * @param {any} project_site_data - Datos del sitio web que se va a asociar con el proyecto, incluyendo la URL y el proveedor.
         * 
         * @returns {Promise<IProjectSite>} - La relación creada entre el proyecto y el sitio web.
         */
        const data_to_created: IProjectSite = {
            ...project_site_data,
            provider_id: project_site_data.provider.id
        }

        const error_message = projectSiteService.checkCreateData(data_to_created)
        if(typeof error_message == 'string') throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)

            
        return await projectSiteModel.create(project_id, data_to_created)
    },

    checkCreateData: (data: any) => {
        /**
         * Valida los datos proporcionados para la creación de una relación entre proyecto y sitio web.
         * 
         * Pasos:
         * 1. Verifica si la URL proporcionada es válida, utilizando una expresión regular para comprobar si la URL sigue el formato estándar.
         * 2. Verifica si el objeto `provider` está presente y tiene un `label` definido.
         * 3. Si los datos no cumplen con los criterios, devuelve un mensaje de error.
         * 
         * @param {any} data - Datos del sitio web que incluyen la URL y el proveedor.
         * 
         * @returns {string | true} - Retorna `true` si los datos son válidos, o un mensaje de error en caso contrario.
         */
        const url_pattern = /^(https?:\/\/)?([\w\d-]+\.)+[\w-]{2,}(\/.*)?$/
        if (!url_pattern.test(data.url)) {
            return `El enlace proporcionado (${data.url}) no es válido`
        }

        if (!data.provider || !data.provider.label) {
            return 'Cada enlace debe tener un proveedor asociado'
        }
        return true
    },

    deleteAllByProject: async (project_id: number) => {
        /**
         * Elimina todas las relaciones de sitios web asociadas a un proyecto.
         * 
         * Pasos:
         * 1. Se ejecuta una consulta SQL para eliminar todas las filas en la tabla `project_sites` que están asociadas con el `project_id` proporcionado.
         * 2. Se retorna el número de filas eliminadas, lo que indica cuántas relaciones fueron eliminadas.
         * 
         * @param {number} project_id - ID del proyecto cuyas relaciones de sitios se van a eliminar.
         * 
         * @returns {Promise<number>} - El número de relaciones eliminadas (número de filas afectadas).
         */
        return await projectSiteModel.deleteAllByProject(project_id)
    }
}