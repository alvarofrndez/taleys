import { env } from '@/config/config_env'
import { IUserRegister, IUser } from '@/modules/users/User.interface'
import IUsersAuthProviders from '@/modules/usersAuthProviders/usersAuthProviders.interface'
import { roleService } from '@/modules/roles/role.service'
import { authModel } from './Auth'
import IAuhtUser from './Auth.interface'
import { usersAuthProvidersService } from '@/modules/usersAuthProviders/usersAuthProviders.service'
import { checkEmail } from './utils/regEx/checkEmail'
import { checkName } from './utils/regEx/checkName'
import { checkUsername } from './utils/regEx/checkUsername'
import { checkPassword } from '@/utils/regEx/checkPassword'
import { userService } from '@/modules/users/user.service'
import hashedPassword from '@/utils/hashed/hasedPassword'
import { storeSession } from '@/utils/redis/sessions'
import verifyPassword from './utils/verifyPassword'
import { OAuth2Client } from 'google-auth-library'
import setNewUsername from './utils/setNewUsername'
import { userModel } from '@/modules/users/User'
import { incrementFailedAttempts } from '@/utils/redis/loginAttemps'
import { securityService } from '@/modules/security/security.service'
import CustomError from '@/modules/customerror/CustomError'

export const authService = {
    login: async (data: IAuhtUser, ip?: string) => {
        if(!data.email?.trim()) throw new CustomError('Rellene el email', 400)

        let user = await userService.getByEmailCheck(data.email)

        if(!user){
            if(data.provider == 'credentials'){
                await incrementFailedAttempts(ip)
                throw new CustomError('Credenciales invalidas')
            } 

            user = await authService.registerUserByProvider(data)
        }else{
            if(data.provider == 'credentials'){
                if(!await verifyPassword(data.password, await userService.getPasswordById(user.id))){
                    await incrementFailedAttempts(ip)
                    throw new CustomError('Credenciales invalidas')
                }
            }else{
                if(!user.avatar_url){
                    const user_to_created = await authService.setUserByProviderData(data)
                    user = await authService.updateUserData(user_to_created, user.id)
                }
            }
        }

        await authService.ensureProviderExists(user.id, data.provider, data.provider_id)

        return await authService.generateAuthResponse(user)
    },

    signIn: async (data: IUserRegister) => {
        await authService.signInValidate(data)

        const new_user = { 
            ...data, 
            password: await hashedPassword(data.password),
            role_id: await roleService.getIdByType(data.type),
            avatar_url: null
        }
        delete new_user.type

        let user_created: IUser = await authModel.signInUser(new_user)
        if(!user_created) throw new CustomError('Error al crear usuario', 400)
        
        await authService.ensureProviderExists(user_created.id, data.provider, data.provider_id)
        return await authService.generateAuthResponse(user_created)
    },

    signInValidate: async (data: IUserRegister) => {
        if(await userService.getByEmailCheck(data.email)) throw new CustomError('El usuario ya existe', 400)
        if(await userService.getByUsernameCheck(data.username)) throw new CustomError('El nombre de usuario ya existe', 400)

        const check_passwords = checkPassword(data.password, data.confirm_password)
        if(typeof check_passwords == 'string') throw new CustomError(check_passwords, 400)

        const error_message = authService.checkUserData(data)
        if(typeof error_message == 'string') throw new CustomError(error_message, 400)
    },

    checkUserData: (data: Record<string, any>) => {
        const function_asignament: Record<string, (value: any) => boolean | string> = {
            name: checkName,
            username: checkUsername,
            email: checkEmail
        }

        for(const [key, value] of Object.entries(data)){
            const validate_function = function_asignament[key]

            if(validate_function){
                const is_valid = validate_function(value)

                if (is_valid !== true) {
                    return is_valid
                }
            }
        }

        return true
    },

    setUserByProviderData: async (data: IAuhtUser) => {
        if(data.provider == 'google'){
            const client = new OAuth2Client(env.GOOGLE_AUTH_CLIENT_ID)

            const ticket = await client.verifyIdToken({
                idToken: data.credential,
                audience: env.GOOGLE_AUTH_CLIENT_ID,
            })

            const payload = ticket.getPayload()
            if (!payload) throw new CustomError('Ha ocurrido un error', 500)

            const new_user: any = payload
            new_user.avatar_url = payload.picture

            return new_user
        }else if(data.provider == 'github'){
            const user_to_created = {
                ...data,
                sub: data.provider_id,
                name: data.name || data.email,
            }

            return user_to_created
        }
    },

    registerUserByProvider: async (data: IAuhtUser) => {
        const user_to_created = await authService.setUserByProviderData(data)
        const new_user: IUserRegister = {
            name: user_to_created.name,
            email: user_to_created.email,
            password: null,
            avatar_url: user_to_created.avatar_url ? user_to_created.avatar_url : null,
            username: await authService.setNewUsername(user_to_created.name),
            role_id: await roleService.getIdByType('user'),
            provider: data.provider,
            provider_id: user_to_created.sub
        }

        const user_created: IUser = await authModel.signInUser(new_user)
        if (!user_created) throw new CustomError('Error al crear usuario', 400)

        return user_created
    },

    ensureProviderExists: async (user_id: number, provider: string, provider_id: string) => {
        const has_provider_active = await usersAuthProvidersService.getByProvider(user_id, provider)

        if(!has_provider_active){
            const account: IUsersAuthProviders = {
                user_id: user_id,
                provider: provider,
                provider_id: provider_id
            }

            await usersAuthProvidersService.setProvider(account)
        }
    },

    setNewUsername: async (username: string) => {
        const is_username_taken = await userService.getByUsernameCheck(username)

        if(is_username_taken) return await authService.setNewUsername(setNewUsername(username))

        return username
    },

    generateAuthResponse: async (user: IUser) => {
        const { token, refresh_token } = await storeSession(user)

        return { user, token, refresh_token, requires_2fa: await securityService.has2faActive(user.id) }
    },

    updateUserData: async (data: any, user_id: number) => {
        const user_to_update = {
            name: data.name,
            avatar_url: data.avatar_url,
        }

        return await userModel.updateUser(user_to_update, user_id)
    }
}

import { createClient } from "redis"