import { Response, NextFunction } from 'express'
import { IUser } from '@/modules/users/User.interface'

export const meController = {
    me: async (req: any, res: Response, next: NextFunction) => {
        const user: IUser = req.user_me

        res.status(201).json({
            success: true,
            message: 'Bienvenido ' + user?.username,
            data: {...user}
        })
    }
}