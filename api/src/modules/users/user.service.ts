import CustomError from '@/modules/customerror/CustomError'
import { userModel } from './User'
import { IUser, IUserDTO } from './User.interface'
import { userFollowService } from './userFollow.service'
import { env } from '@/config/config_env'
import { projectService } from '../projects/project.service'

export const userService = {
    getByEmail: async (email: string) => {
        const user = await userModel.getByEmail(email)
        if (!user) throw new CustomError('El usuario no existe', 404, env.DATA_NOT_FOUND_CODE)
        return await userService.getAllData(user)
    },

    getByEmailCheck: async (email: string) => {
        const user = await userModel.getByEmail(email)
        if (!user) return null
        return await userService.getAllData(user)
    },
    
    getById: async (id: number) => {
        const user = await userModel.getById(id)
        if (!user) throw new CustomError('El usuario no existe', 404, env.DATA_NOT_FOUND_CODE)
        return await userService.getAllData(user)
    },

    getByIdLite: async (id: number) => {
        const user = await userModel.getById(id)
        if (!user) throw new CustomError('El usuario no existe', 404, env.DATA_NOT_FOUND_CODE)
        return user
    },

    getByIdDTO: async (id: number) => {
        const user: IUserDTO = await userModel.getByIdDTO(id)
        if (!user) throw new CustomError('El usuario no existe', 404, env.DATA_NOT_FOUND_CODE)
        return user
    },
    
    getByUsername: async (username: string) => {
        const user = await userModel.getByUsername(username)
        if (!user) throw new CustomError('El usuario no existe', 404, env.DATA_NOT_FOUND_CODE)
        return await userService.getAllData(user)
    },

    getByUsernameCheck: async (username: string) => {
        const user = await userModel.getByUsername(username)
        if (!user) return null
        return await userService.getAllData(user)
    },
    
    getPasswordById: async (id: number) => {
        return await userModel.getPasswordById(id)
    },
    
    getAll: async () => {
        const users = await userModel.getAll()
        return await Promise.all(users.map(user => userService.getAllData(user)))
    },
    
    getAllData: async (user: IUser) => {
        const user_with_all_data = { ...user }
    
        user_with_all_data.followers = await userFollowService.getByUserFollowers(user.id)
        user_with_all_data.follows = await userFollowService.getByUserFollows(user.id)
        user_with_all_data.projects = await projectService.getAllByUser(user.id)
    
        return user_with_all_data
    },

    update: async (user: IUser) => {
        const check_data = await userService.checkData(user)
        if(typeof check_data === 'string') throw new CustomError(check_data, 400)

        const response = await userModel.updateUser(user, user.id)

        return await userService.getAllData(response)
    },

    checkData: async (user: IUser) => {
        if(!user.name || !user.username || !user.email) {
            return 'Faltan datos'
        }

        if(user.name.length < 3 || user.name.length > 50) {
            return 'El nombre debe tener entre 3 y 50 caracteres'
        }

        if(user.username.length < 3 || user.username.length > 50) {
            return 'El nombre de usuario debe tener entre 3 y 50 caracteres'
        }

        const user_by_username = await userModel.getByUsername(user.username)
        if(user_by_username && user_by_username.id !== user.id) {
            return 'El nombre de usuario ya está en uso'
        }

        return true
    }
}