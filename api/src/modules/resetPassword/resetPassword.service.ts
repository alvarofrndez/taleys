import { env } from '@/config/config_env'
import { userService } from '@/modules/users/user.service'
import jwt from 'jsonwebtoken'
import loadTemplate from '@/utils/templates/loadTemplate'
import { IUser } from '@/modules/users/User.interface'
import { checkPassword } from '@/utils/regEx/checkPassword'
import { userModel } from '@/modules/users/User'
import hashedPassword from '@/utils/hashed/hasedPassword'
import CustomError from '@/modules/customerror/CustomError'

export const resetPasswordService = {
    forgotPassword: async (email: string) => {
        const user:IUser = await userService.getByEmail(email)
        if(!user) throw new CustomError('Usuario no encontrado', 404)

        const reset_token = jwt.sign({ id: user.id, email: user.email }, env.RESET_PASSWORD_SECRET, { expiresIn: env.RESET_PASSWORD_EXPIRE_IN })

        const reset_link = `${env.FRONTEND_URL}/reset-password/${reset_token}`

        return loadTemplate('reset-password', {reset_link})
    },

    validateToken: (token: string) => {
        try{
            const decoded = jwt.verify(token, env.RESET_PASSWORD_SECRET)

            return decoded
        }catch(error){
            throw new CustomError('Token inválido o expirado', 400, env.INVALID_TOKEN_CODE)
        }
    },

    resetPassword: async (password: string, confirm_password: string, user_id: number) => {
        let user:IUser = await userService.getById(user_id)
        if(!user) throw new CustomError('Usuario no encontrado', 404)

        const check_passwords = checkPassword(password, confirm_password)
        if(typeof check_passwords == 'string') throw new CustomError(check_passwords, 400)

        user.password = await hashedPassword(password)

        return await userModel.updateUser(user, user_id)
    },
}