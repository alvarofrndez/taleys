import { Response, NextFunction } from 'express'
import { env } from '@/config/config_env'
import { userService } from '@/modules/users/user.service'
import CustomError from '@/modules/customerror/CustomError'

const userRequired = async (req: any, res: Response, next: NextFunction) => {
    try{
        const { user_id } = req.params
    
        const user = await userService.getByIdLite(user_id)
        if (!user) throw new CustomError('No se encontró el usuario', 404, env.DATA_NOT_FOUND_CODE)

        req.user = user
        next()
    }catch(error){
        next(error)
    }
}

export { userRequired }