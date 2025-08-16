import { env } from '@/config/config_env'
import { IUser } from '@/modules/users/User.interface'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import { securityModel } from './Security'
import crypto from 'crypto'
import { checkPassword } from '@/utils/regEx/checkPassword'
import hashedPassword from '@/utils/hashed/hasedPassword'
import { userModel } from '@/modules/users/User'
import argon2 from 'argon2'
import { userService } from '@/modules/users/user.service'
import verifyPassword from '@/modules/auth/utils/verifyPassword'
import CustomError from '@/modules/customError/CustomError'

export const securityService = {
    selectByUserId: async (user_id: number) => {
        const security = await securityModel.selectByUserId(user_id)

        return security
    },

    has2faActive: async (user_id: number) => {
        const result = await securityModel.has2faActive(user_id)

        if(!result) return false

        const {is_2fa_enabled} = result

        return is_2fa_enabled
    },

    generate2fa: async (user: IUser) => {
        const secret = speakeasy.generateSecret({ length: 20, name: `${env.NAME}: ${user.email}` })

        const qr_code = await QRCode.toDataURL(secret.otpauth_url)

        return{
            qr_code,
            secret
        }
    },

    enable2fa: async (user: IUser, totp_code: string, secret: string) => {
        if(await securityService.has2faActive(user.id)) throw new CustomError('Ya tienes el método activado', 400)

        securityService.vetifyTotpCode(totp_code, secret) 

        if(!await securityModel.enable2fa(user.id, secret, 'TOTP')) throw new CustomError('Error al activar el método', 403)

        return true
    },

    disable2fa: async (user_id: number) => {
        if(!await securityModel.disable2fa(user_id)) throw new CustomError('Error al desactivar doble factor de autentifiación', 403)

        return true
    },

    generateBackupCodes: async (user_id: number) => {
        const codes: string[] = [];

        for (let i = 0; i < 5; i++) {
            const code = crypto.randomBytes(4).toString("hex").toUpperCase()
            codes.push(code)
        }

        const final_codes: string = codes.join(' ')

        if(!await securityModel.saveBackupCodes(user_id, final_codes)) throw new CustomError('Error al generar códigos de respaldo', 403)

        return final_codes
    },

    vetifyTotpCode: (totp_code: string, secret: string) => {
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: totp_code
        })

        if(!verified) throw new CustomError('Código no válido', 400)
    },

    vetifyBackupCode: (send_backup_codes: string, backup_codes: string) => {
        if(send_backup_codes != backup_codes) throw new CustomError('Códigos de respaldo no válido', 400)
    },

    create: async (user_id: number, ip: string) => {
        if(!await securityModel.create(user_id, ip)) throw new CustomError('Error al activar la seguridad', 400)
    },

    updateLastLoginIp: async (user_id: number, ip: string) => {
        if(! await securityModel.selectByUserId(user_id)){
            if(!await securityModel.create(user_id, ip)) throw new CustomError('Error al activar la seguridad', 400)
        }else{
            if(!await securityModel.updateLastLoginIp(user_id, ip)) throw new CustomError('Error al acutalizar la ip', 400)
        }
    },

    changePassword: async (user: IUser, current_password: string, new_password: string, confirm_password: string) => {
        if(current_password == new_password) throw new CustomError('La nueva contraseña no puede ser igual a la contraseña actual', 400)

        if(!await verifyPassword(current_password, await userService.getPasswordById(user.id))) throw new CustomError('Contraseña actual incorrecta', 400)

        const check_password = checkPassword(new_password, confirm_password)
        if(typeof check_password == 'string') throw new CustomError(check_password, 400)

        user.password = await hashedPassword(new_password)

        return await userModel.updateUser(user, user.id)
    }
}