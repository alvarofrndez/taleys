import { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import { authService } from './auth.service'
import { IUserRegister } from '@/modules/users/User.interface'
import { env } from '@/config/config_env'
import { setAuthToken } from '@/utils/cookies/setAuthToken'
import { invalidateSession } from '@/utils/redis/sessions'
import { removeAuthToken } from '@/utils/cookies/removeAuthToken'
import { checkFailedAttempts, clearFailedAttempts, incrementFailedAttempts } from '@/utils/redis/loginAttemps'
import { verifyRecaptcha } from '@/utils/catpcha/verifyCatpcha'
import { securityService } from '@/modules/security/security.service'
import CustomError from '@/modules/customerror/CustomError'

export const authController = {
    signIn: async (req: Request, res: Response, next: NextFunction) => {
        const data: IUserRegister = req.body

        const {user, token} = await authService.signIn(data)

        await securityService.create(user.id, req.ip)
        
        setAuthToken(res, token)

        res.status(201).json({
            success: true,
            message: 'Usuario creado correctamente',
            data: {...user}
        })
    },
    
    login: async (req: Request, res: Response, next: NextFunction) => {
        const data = req.body

        const needs_captcha = await checkFailedAttempts(req.ip, 3)

        if(needs_captcha){
            if(await checkFailedAttempts(req.ip, 4)) throw new CustomError('Has superado el limite de intentos, vuelva a intentarlo en un rato', 403)
            if(!data.captcha_token){
                incrementFailedAttempts(req.ip)
                throw new CustomError('No se ha validado el captcha', 403)
            } 
            if(!await verifyRecaptcha(data.captcha_token)){
                incrementFailedAttempts(req.ip)
                throw new CustomError('El captcha es invalido', 403)
            } 
        }

        const {user, token, refresh_token, requires_2fa} = await authService.login(data, req.ip)

        if (requires_2fa) {
            if (!data.totp_code && !data.backup_codes) {
                res.status(200).json({
                    success: false,
                    message: 'Se requiere código de autenticación de doble factor'
                })
                return
            }

            const security = await securityService.selectByUserId(user.id)

            if(data.totp_code){
                securityService.vetifyTotpCode(data.totp_code, security['2fa_secret'])
            }else{
                securityService.vetifyBackupCode(data.backup_codes, security['2fa_backup_codes'])
            }
        }

        setAuthToken(res, token, refresh_token)

        await clearFailedAttempts(req.ip)
        await securityService.updateLastLoginIp(user.id, req.ip)

        res.status(201).json({
            success: true,
            message: `Bienvenido ${user.username}`,
            data: {...user}
        })
    },

    loginWithGithub: async (req: Request, res: Response, next: NextFunction) => {
        const { code } = req.body
        
        if (!code) throw new CustomError('código no proporcionado', 400)

        const token_response = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: env.GITHUB_AUTH_CLIENT_ID,
                client_secret: env.GITHUB_AUTH_SECRET,
                code,
            },
            { headers: { Accept: 'application/json' } }
        )

        const access_token = token_response.data.access_token
        if (!access_token) throw new CustomError('error al obtener token de acceso', 500)

        const {data: user_response} = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${access_token}` },
        })

        const email_response = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${access_token}` },
        })

        const user_email = email_response.data.find((email: any) => email.primary)?.email

        const github_user = {
            provider: 'github',
            provider_id: user_response.id.toString(),
            email: user_email,
            name: user_response.name,
            avatar_url: user_response.avatar_url,
        }

        const {user, token, refresh_token, requires_2fa} = await authService.login(github_user)

        if (requires_2fa) {
            res.status(200).json({
                success: false,
                data: github_user,
                message: 'Se requiere código de autenticación de doble factor'
            })
            return
        }
        setAuthToken(res, token, refresh_token)

        res.status(201).json({
            success: true,
            message: `Bienvenido ${user.username}`,
            data: {...user}
        })
    },
    
    logout: async (req: any, res: Response, next: NextFunction) => {
        const session_id = req.session_id

        await invalidateSession(session_id)

        removeAuthToken(res)

        res.status(200).json({
            success: true,
            message: `Hasta pronto`
        })
    },

    verifyRecaptcha: async (token: string) => {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: env.GOOGLE_RECAPTCHA_SECRET,
                response: token,
            },
        })
        return response.data.success
    },

    autorizado: async (req: any, res: Response, next: NextFunction) => {
        res.status(201).json({
            success: true,
            message: `Estas autorizado`,
            data: {...req.user_me}
        })
    }
}