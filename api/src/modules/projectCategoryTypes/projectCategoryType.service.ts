import { projectCategoryTypeModel } from './ProjectCategoryType'

export const projectCategoryTypeService = {
    getById: async (id: number) => {
        return await projectCategoryTypeModel.getById(id)
    },

    getByValue: async (value: string) => {
        return await projectCategoryTypeModel.getByValue(value)
    },

    getAll: async () => {
        return await projectCategoryTypeModel.getAll()
    }
}