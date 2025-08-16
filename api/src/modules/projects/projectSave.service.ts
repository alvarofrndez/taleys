import { projectSaveModel } from './ProjectSave'

export const projectSaveService = {
    getByProject: async (project_id: number) => {
        return await projectSaveModel.getByProject(project_id)
    },

    getByProjectAndUser: async (project_id: number, user_id: number) => {
        return await projectSaveModel.getByProjectAndUser(project_id, user_id)
    },

    getProyectCount: async (project_id: number) => {
        /**
         * Obtiene el número de guardados de un proyecto
         * 
         * @param {number} project_id - ID del proyecto.
         * @returns {number} Número de guardados.
         */

        return await projectSaveModel.getProyectCount(project_id)
    },

    addSave: async (project_id: number, user_id: number) => {
        return await projectSaveModel.addSave(project_id, user_id)
    },

    removeSave: async (project_id: number, user_id: number) => {
        return await projectSaveModel.removeSave(project_id, user_id)
    },

    deleteAllByProject: async (project_id: number) => {
        /**
         * Elimina todos los guardados asociados a un proyecto.
         *
         * @param {number} project_id - ID del comentario.
         */
        await projectSaveModel.deleteAllByProject(project_id)
    },
}
