import { Response, NextFunction } from 'express'
import { securityService } from './security.service'

export const securityController = {
    has2faActive: async (req: any, res: Response, next: NextFunction) => {
        const response = await securityService.has2faActive(req.user_me.id)

        res.status(200).json({
            success: true,
            data: response,
            message: 'Codigos generados'
        })
    },

    generate2fa: async (req: any, res: Response, next: NextFunction) => {
        const response = await securityService.generate2fa(req.user_me)

        res.status(200).json({
            success: true,
            data: response,
            message: 'Codigos generados'
        })
    },

    enable2fa: async (req: any, res: Response, next: NextFunction) => {
        const { totp_code, secret } = req.body
        await securityService.enable2fa(req.user_me, totp_code, secret)

        res.status(200).json({
            success: true,
            message: 'Doble factor autentifiación activado'
        })
    },

    disable2fa: async (req: any, res: Response, next: NextFunction) => {
        await securityService.disable2fa(req.user_me.id)

        res.status(200).json({
            success: true,
            message: 'Doble factor autentifiación desactivado'
        })
    },

    generateBackupCodes: async (req: any, res: Response, next: NextFunction) => {
        const codes = await securityService.generateBackupCodes(req.user_me.id)

        res.status(200).json({
            success: true,
            data: codes,
            message: 'Códigos de respaldo guardados'
        })
    },

    verifyTotp: async (req: any, res: Response, next: NextFunction) => {
        const codes = await securityService.generateBackupCodes(req.user_me.id)

        res.status(200).json({
            success: true,
            data: codes,
            message: 'Códigos de respaldo guardados'
        })
    },

    verifyBackup: async (req: any, res: Response, next: NextFunction) => {
        const codes = await securityService.generateBackupCodes(req.user_me.id)

        res.status(200).json({
            success: true,
            data: codes,
            message: 'Códigos de respaldo guardados'
        })
    },

    changePassword: async (req: any, res: Response, next: NextFunction) => {
        const { current_password, new_password, confirm_password } = req.body
        await securityService.changePassword(req.user_me, current_password, new_password, confirm_password)

        res.status(200).json({
            success: true,
            message: 'Contraseña actualizada'
        })
    }
    
}