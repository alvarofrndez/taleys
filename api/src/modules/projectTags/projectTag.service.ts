import { tagService } from '@/modules/tags/tag.service'
import { projectTagModel } from './ProjectTag'
import { IProjectTag } from './projectTag.interface'
import { ITag } from '@/modules/tags/tag.interface'

export const projectTagService = {
    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene t0das las etiquetas de un proyecto
         * 
         * Pasos:
         * 1. Llama a `projectTagModel.getAllByProject()` con el `project_id` para obtener todas las etiquetas
         * del proyecto.
         * 2. Por cada categoria llama a `tagService.getById()` con el `tag.type_id` para obtener los datos
         * de la categoría
         * 3. Devuelve una lista de las etiquetas del proyecto.
         * 
         * @param {number} project_id - ID del proyecto que se quiere consultar.
         * 
         * @returns {Promise<IProjectTag[]>} - Lista de las etiquetas del proyecto.
         */
        const tags = await projectTagModel.getAllByProject(project_id)
        let final_tags = []

        for(let tag of tags){
            final_tags.push({
                ...tag,
                tag: await tagService.getById(tag.tag_id)
            })
        }

        return final_tags
    },

    getAllByProjectLite: async (project_id: number) => {
        /**
         * Obtiene t0das las etiquetas de un proyecto, con los datos simples de estas,
         * necesario para editar un proyecto
         * 
         * Pasos:
         * 1. Llama a `projectTagModel.getAllByProject()` con el `project_id` para obtener todas las etiquetas
         * del proyecto.
         * 2. Por cada categoria llama a `tagService.getById()` con el `tag.type_id` para obtener los datos
         * de la categoría
         * 3. Devuelve una lista de las etiquetas del proyecto.
         * 
         * @param {number} project_id - ID del proyecto que se quiere consultar.
         * 
         * @returns {Promise<IProjectTag[]>} - Lista de las etiquetas del proyecto.
         */
        const tags = await projectTagModel.getAllByProject(project_id)
        let final_tags = []

        for(let tag of tags){
            final_tags.push({
                ... await tagService.getById(tag.tag_id),
                tag_project_id: tag.id
            })
        }

        return final_tags
    },

    create: async (project_id: number, project_tag_data: any) => {
        /**
         * Crea una nueva relación entre un proyecto y una etiqueta, o asocia una etiqueta ya existente a un proyecto.
         * 
         * Pasos:
         * 1. Se busca una etiqueta existente en el sistema con el valor proporcionado (`project_tag_data`) usando el servicio `tagService.getByValue`.
         * 2. Si la etiqueta ya existe, se crea una relación en la tabla de proyectos con la etiqueta encontrada, asociando el `tag_id` con el `project_id`.
         * 3. Si la etiqueta no existe, se crea una nueva etiqueta en el sistema utilizando el servicio `tagService.create`, y luego se crea la relación con el `project_id` y el nuevo `tag_id`.
         * 4. Finalmente, se devuelve la relación creada entre el proyecto y la etiqueta.
         * 
         * @param {number} project_id - ID del proyecto al que se va a asociar la etiqueta.
         * @param {any} project_tag_data - Los datos de la etiqueta (puede ser un valor de la etiqueta o un objeto que contenga la etiqueta).
         * 
         * @returns {Promise<IProjectTag>} - La relación creada entre el proyecto y la etiqueta.
         */
        const tag: ITag = await tagService.getByValue(project_tag_data)

        if(tag){
            const project_tag_created_data: IProjectTag = {
                tag_id: tag.id
            }

            return await projectTagModel.create(project_id, project_tag_created_data)
        }else{
            const tag_created_data = {
                value: project_tag_data
            }
            const new_tag: ITag = await tagService.create(tag_created_data)
            
            const project_tag_created_data: IProjectTag = {
                tag_id: new_tag.id
            }

            return await projectTagModel.create(project_id, project_tag_created_data)
        }
    },

    deleteAllByProject: async (project_id: number) => {
        /**
         * Elimina todas las relaciones de etiquetas asociadas a un proyecto específico.
         * 
         * Pasos:
         * 1. Se ejecuta una consulta SQL `DELETE FROM` para eliminar todas las filas de la tabla de relaciones de etiquetas de proyectos (`project_tags`) que estén asociadas al `project_id` dado.
         * 2. La consulta elimina todas las asociaciones de etiquetas a ese proyecto.
         * 3. Retorna el número de filas eliminadas, es decir, cuántas relaciones de etiquetas fueron eliminadas.
         * 
         * @param {number} project_id - ID del proyecto cuyas relaciones con las etiquetas se van a eliminar.
         * 
         * @returns {Promise<number>} - El número de relaciones eliminadas (número de filas afectadas).
         */
        return await projectTagModel.deleteAllByProject(project_id)
    }
}