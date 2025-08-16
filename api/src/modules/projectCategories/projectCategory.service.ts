import { env } from '@/config/config_env'
import CustomError from '@/modules/customerror/CustomError'
import { projectCategoryModel } from './ProjectCategory'
import { IProjectCategory } from './projectCategory.interface'
import { projectCategoryTypeService } from '@/modules/projectCategoryTypes/projectCategoryType.service'

export const projectCategoryService = {
    getAllByProject: async (project_id: number) => {
        /**
         * Obtiene todas las categorias de un proyecto
         * 
         * Pasos:
         * 1. Llama a `projectCategoryModel.getAllByProject()` con el `project_id` para obtener todas las categorias
         * del proyecto.
         * 2. Por cada categoria llama a `projectCategoryTypeService.getById()` con el `category.type_id` para obtener los datos
         * de la categoría
         * 3. Devuelve una lista de las categorias del proyecto.
         * 
         * @param {number} project_id - ID del proyecto que se quiere consultar.
         * 
         * @returns {Promise<IProjectCategory[]>} - Lista de las categorias del proyecto.
         */
        const categories = await projectCategoryModel.getAllByProject(project_id)
        let final_categories = []

        for(let category of categories){
            final_categories.push({
                ...category,
                type: await projectCategoryTypeService.getById(category.type_id)
            })
        }

        return final_categories
    },

    getAllByProjectLite: async (project_id: number) => {
        /**
         * Obtiene todas las categorias de un proyecto, con los datos simples de estas,
         * necesario para editar un proyecto
         * 
         * Pasos:
         * 1. Llama a `projectCategoryModel.getAllByProject()` con el `project_id` para obtener todas las categorias
         * del proyecto.
         * 2. Por cada categoria llama a `projectCategoryTypeService.getById()` con el `category.type_id` para obtener los datos
         * de la categoría
         * 3. Devuelve una lista de las categorias del proyecto.
         * 
         * @param {number} project_id - ID del proyecto que se quiere consultar.
         * 
         * @returns {Promise<IProjectCategory[]>} - Lista de las categorias del proyecto.
         */
        const categories = await projectCategoryModel.getAllByProject(project_id)
        let final_categories = []

        for(let category of categories){
            final_categories.push({
                ...await projectCategoryTypeService.getById(category.type_id),
                project_category_id: category.id
            })
        }

        return final_categories
    },

    create: async (project_id: number, project_category_data: any) => {
        /**
         * Crea una nueva categoría asociada a un proyecto.
         * 
         * Pasos:
         * 1. Se obtiene el tipo de categoría (`project_category_type`) correspondiente al valor de la categoría a través de un servicio (`projectCategoryTypeService.getByValue`).
         * 2. Se crea un objeto `project_category_created_data` que combina los datos de la categoría proporcionados (`project_category_data`) y el `type_id` obtenido del tipo de categoría.
         * 3. Se valida que los datos para crear la categoría sean correctos mediante el método `checkCreateData`.
         * 4. Si los datos no son válidos, se lanza un error con un mensaje adecuado.
         * 5. Si los datos son correctos, se inserta la categoría en la base de datos asociada al proyecto utilizando `projectCategoryModel.create`.
         * 6. Devuelve la categoría recién creada.
         * 
         * @param {number} project_id - ID del proyecto al que se va a asociar la categoría.
         * @param {any} project_category_data - Datos de la categoría a crear, que incluyen el valor de la categoría, entre otros.
         * 
         * @returns {Promise<IProjectCategory>} - La categoría recién creada asociada al proyecto.
         */
        const project_category_type = await projectCategoryTypeService.getByValue(project_category_data.value)
        const project_category_created_data = {
            ...project_category_data,
            type_id: project_category_type.id
        }

        const error_message = projectCategoryService.checkCreateData(project_category_created_data)
        if(typeof error_message == 'string') throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)
            
        return await projectCategoryModel.create(project_id, project_category_created_data)
    },

    checkCreateData: (data: IProjectCategory) => {
        /**
         * Valida los datos para la creación de una categoría de proyecto.
         * 
         * Pasos:
         * 1. Verifica si el campo `type_id` está presente en los datos. Si no lo está, se retorna un mensaje de error.
         * 2. Si los datos son válidos (el `type_id` está presente), se retorna `true` indicando que los datos son correctos.
         * 
         * @param {IProjectCategory} data - Datos de la categoría de proyecto a validar.
         * 
         * @returns {string | boolean} - Retorna un mensaje de error si los datos no son válidos, o `true` si los datos son válidos.
         */
        if(!data.type_id) return 'No se encuentra la categoria'

        return true
    },

    deleteAllByProject: async (project_id: number) => {
        /**
         * Elimina todas las categorías asociadas a un proyecto específico.
         * 
         * Pasos:
         * 1. Llama al método `deleteAllByProject` de `projectCategoryModel`, pasando el `project_id`, para eliminar todas las categorías asociadas a ese proyecto en la base de datos.
         * 2. Retorna el número de filas eliminadas, lo que indica cuántas categorías fueron eliminadas.
         * 
         * @param {number} project_id - ID del proyecto cuyas categorías se van a eliminar.
         * 
         * @returns {Promise<number>} - El número de categorías eliminadas.
         */
        return await projectCategoryModel.deleteAllByProject(project_id)
    }
}