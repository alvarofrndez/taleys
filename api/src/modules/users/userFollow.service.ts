import CustomError from '@/modules/customerror/CustomError'
import { userFollowModel } from './UserFollow'
import { IUserFollow } from './userFollow.interface'
import { userService } from './user.service'

export const userFollowService = {
    getByUserFollowers: async (followed_id: number) => {
        /**
         * Obtiene todos los seguidores de un usuario
         * 
         * @param {number} followed_id - ID del usuario.
         * 
         * @returns {IUserFollow} 'true' si se existe el seguimiento.
         */

        const followers:IUserFollow[]  = await userFollowModel.getByUserFollowers(followed_id)

        let final_followers = []
        for(let follow of followers) {
            final_followers.push(await userService.getByIdLite(follow.follower_id))
        }

        return final_followers
    },

    getByUserFollows: async (follower_id: number) => {
        /**
         * Obtiene todos los seguimientos de un usuario
         * 
         * @param {number} follower_id - ID del usuario.
         * 
         * @returns {IUserFollow} 'true' si se existe el seguimiento.
         */

        const follows:IUserFollow[] = await userFollowModel.getByUserFollows(follower_id)

        let final_followers = []
        for(let follow of follows) {
            final_followers.push(await userService.getByIdLite(follow.followed_id))
        }

        return final_followers
    },

    getByUsers: async (follower_id: number, followed_id: number) => {
        /**
         *Obtiene el seguimiento de un usuarioa otro
         * 
         * @param {number} follower_id - ID del usuario que solicita el seguimiento.
         * @param {number} followed_id - ID del usuario que al que se le solicita el seguimiento.
         * 
         * @returns {IUserFollow} 'true' si se existe el seguimiento.
         */

        const result = await userFollowModel.getByUsers(follower_id, followed_id)

        if(result){
            return {
                follower: await userService.getById(follower_id),
                followed: await userService.getById(followed_id)
            }
        }else{
            return false
        }
    },
    
    follow: async (follower_id: number, followed_id: number) => {
        /**
         * Añade un seguimiento de un usuario a otro
         * 
         * @param {number} follower_id - ID del usuario que solicita el seguimiento.
         * @param {number} followed_id - ID del usuario que al que se le solicita el seguimiento.
         * 
         * @returns {boolean} 'true' si se ha seguido.
         */
        return await userFollowModel.follow(follower_id, followed_id)
    },

    unfollow: async (follower_id: number, followed_id: number) => {
        /**
         * Elimina un seguimiento de un usuario a otro
         * 
         * @param {number} follower_id - ID del usuario que solicita el seguimiento.
         * @param {number} followed_id - ID del usuario que al que se le solicita el seguimiento.
         * 
         * @returns {boolean} 'true' si se ha eliminado.
         */
        return await userFollowModel.unfollow(follower_id, followed_id)
    },
}