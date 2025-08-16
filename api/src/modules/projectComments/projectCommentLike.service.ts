import { projectCommentLikeModel } from './ProjectCommentLike'

export const projectCommentLikeService = {
    getByComment: async (comment_id: number) => {
        return await projectCommentLikeModel.getByComment(comment_id)
    },

    getByCommentAndUser: async (comment_id: number, user_id: number) => {
        return await projectCommentLikeModel.getByCommentAndUser(comment_id, user_id)
    },

    addLike: async (comment_id: number, user_id: number) => {
        return await projectCommentLikeModel.addLike(comment_id, user_id)
    },

    removeLike: async (comment_id: number, user_id: number) => {
        return await projectCommentLikeModel.removeLike(comment_id, user_id)
    },

    deleteAllByComment: async (comment_id: number): Promise<void> => {
        /**
         * Elimina todos los likes asociados a un comentario.
         *
         * @param {number} comment_id - ID del comentario.
         */
        await projectCommentLikeModel.deleteAllByComment(comment_id)
    },

    getLikesCount: async (comment_id: number): Promise<number> => {
        return await projectCommentLikeModel.getLikesCount(comment_id)
    }
}
