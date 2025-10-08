import { NextFunction, Response } from 'express'
import { userService } from './user.service'
import { userFollowService } from './userFollow.service'
import { IUser } from './User.interface'

export const userController = {
    getAll: async (req: any, res: Response, next: NextFunction) => {
        const users = await userService.getAll()

        res.status(200).json({
            success: true,
            message: 'Usuarios obtenidos',
            data: users
        })
    },

    getById: async (req: any, res: Response, next: NextFunction) => {
        const { user_id } = req.params
        const user_me = req.user_me

        if(user_id == user_me?.id){
            const user = await userService.getAllData(user_me)
            res.status(200).json({
                success: true,
                message: 'Usuario obtenido',
                data: user
            })
            return
        }
        
        const user = await userService.getById(user_id)

        res.status(200).json({
            success: true,
            message: 'Usuario obtenido',
            data: user
        })
    },

    getByUsername: async (req: any, res: Response, next: NextFunction) => {
        const { username } = req.params
        
        const user = await userService.getByUsername(username)

        res.status(200).json({
            success: true,
            message: 'Usuario obtenido',
            data: user
        })
    },

    update: async (req: any, res: Response, next: NextFunction) => {
        const user = req.user_me
        const { name, username, description, avatar_url } = req.body

        user.name = name
        user.username = username
        user.description = description
        user.avatar_url = avatar_url
        
        const updated_user = await userService.update(user)

        res.status(200).json({
            success: true,
            message: 'Usuario actualizado correctamente',
            data: updated_user
        })
    },

    follow: async (req: any, res: Response, next: NextFunction) => {
        /**
         * Gestiona los seguimientos de los usuarios, siguiendo o dejando de seguir
         * según cual fuese el anterior estado
         */
        const user = req.user_me
        const { user_id } = req.params

        const follow = await userFollowService.getByUsers(user.id, user_id)
        
        if (follow) {
            await userFollowService.unfollow(user.id, user_id)
            res.status(200).json({
                success: true,
                message: 'Dejaste de seguir al usuario'
            })
        } else {
            await userFollowService.follow(user.id, user_id)
            res.status(200).json({
                success: true,
                message: 'Usuario seguido'
            })
        }
    }
}