import { Response, NextFunction } from 'express'
import { sendEmail } from '@/utils/middlewares/mailgun'
import { env } from '@/config/config_env'

export const featuresController = {
    feature: async (req: any, res: Response, next: NextFunction) => {
        const user = req.user_me
    
        res.status(200).json({
            success: true,
            message: 'Estas autorizado',
            data: user
        })
    }
}