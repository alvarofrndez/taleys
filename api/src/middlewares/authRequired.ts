import { Response, NextFunction } from 'express'
import { env } from '@/config/config_env'
import jwt from 'jsonwebtoken'
import { getSession, refreshSession } from '@/utils/redis/sessions'
import { userService } from '@/modules/users/user.service'
import CustomError from '@/modules/customError/CustomError'

const authRequired = async (req: any, res: Response, next: NextFunction) => {
    return await middleware(req, res, next, env.UNAUTHENTICATED_CODE)
}

const meAuthRequired = async (req: any, res: Response, next: NextFunction) => {
    return await middleware(req, res, next, env.ME_UNAUTHENTICATED_CODE)
}

const middleware = async (req: any, res: Response, next: NextFunction, type: string) => {
    try{
        const token = req.cookies.token

        if (!token) {
            return await refreshSession(req, res, next, type)
        }
    
        let decoded: any
    
        try {
            decoded = jwt.verify(token, env.JWT_SECRET)
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return await refreshSession(req, res, next, type)
            }
            throw new CustomError('Token inválido', 401, type)
        }
    
        if(!await userService.getByIdLite(decoded.user.id)) throw new CustomError('Token inválido', 401, type)
    
        if (!decoded || !decoded.session_id) throw new CustomError('Token inválido', 401, type)
    
        const session = await getSession(decoded.session_id)
        if (!session) throw new CustomError('Sesión expirada', 401, type)
    
        req.user_me = decoded.user
        req.session = decoded.session_id
        next()
    }catch(error){
        next(error)
    }
    
}

export { authRequired, meAuthRequired }