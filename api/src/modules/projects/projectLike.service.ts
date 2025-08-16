import { projectLikeModel } from './ProjectLike'

export const projectLikeService = {
    getByProject: async (project_id: number) => {
        return await projectLikeModel.getByProject(project_id)
    },

    getByProjectAndUser: async (project_id: number, user_id: number) => {
        return await projectLikeModel.getByProjectAndUser(project_id, user_id)
    },

    getProyectCount: async (project_id: number) => {
        /**
         * Obtiene el número de likes de un proyecto
         * 
         * @param {number} project_id - ID del proyecto.
         * @returns {number} Número de likes.
         */

        return await projectLikeModel.getProyectCount(project_id)
    },

    addLike: async (project_id: number, user_id: number) => {
        return await projectLikeModel.addLike(project_id, user_id)
    },

    removeLike: async (project_id: number, user_id: number) => {
        return await projectLikeModel.removeLike(project_id, user_id)
    },

    deleteAllByProject: async (project_id: number) => {
        /**
         * Elimina todos los likes asociados a un proyecto.
         *
         * @param {number} project_id - ID del comentario.
         */
        await projectLikeModel.deleteAllByProject(project_id)
    },
}
