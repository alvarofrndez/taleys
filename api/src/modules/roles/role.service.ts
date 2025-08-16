import { roleModel } from './Role'

export const roleService = {
    getIdByType: async (type: string) => {
        return await roleModel.getIdByType(type)
    },

    getPriorityById: async (id: number) => {
        return await roleModel.getPriorityById(id)
    },

    getPriorityByType: async (type: string) => {
        return await roleModel.getPriorityByType(type)
    },
}