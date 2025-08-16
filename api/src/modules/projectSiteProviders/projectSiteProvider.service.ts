import { projectSiteProviderModel } from './ProjectSiteProvider'

export const projectSiteProviderService = {
    getById: async (id: number) => {
        return await projectSiteProviderModel.getById(id)
    },

    getByValue: async (value: string) => {
        return await projectSiteProviderModel.getByValue(value)
    },

    getAll: async () => {
        return await projectSiteProviderModel.getAll()
    }
}