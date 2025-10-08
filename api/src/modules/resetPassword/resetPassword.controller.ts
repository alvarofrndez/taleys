import { Response, NextFunction } from 'express'
import { sendEmail } from '@/utils/middlewares/mailgun'
import { env } from '@/config/config_env'
import { resetPasswordService } from './resetPassword.service'
import CustomError from '@/modules/customerror/CustomError'

export const featuresController = {
    forgotPassword: async (req: any, res: Response, next: NextFunction) => {
        const { email } = req.body

        const html = await resetPasswordService.forgotPassword(email)

        const response = await sendEmail([env.MAILGUN_FROM], 'Cambio de contraseña', html)

        res.status(response.status).json(response)
    },

    validateToken: async (req: any, res: Response, next: NextFunction) => {
        const { token } = req.body

        resetPasswordService.validateToken(token)

        res.status(200).json({
            success: true,
            message: 'Token valido'
        })
    },

    resetPassword: async (req: any, res: Response, next: NextFunction) => {
        const { password, confirm_password, token } = req.body

        const decoded: any = resetPasswordService.validateToken(token)

        if(!decoded.id) throw new CustomError('No es posible identificar el usuario', 400)

        await resetPasswordService.resetPassword(password, confirm_password, decoded.id)

        res.status(201).json({
            success: true,
            message: 'Contraseña recuperada'
        })
    }
}