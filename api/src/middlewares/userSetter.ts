import { Response, NextFunction } from 'express'
import { env } from '@/config/config_env'
import jwt from 'jsonwebtoken'
import { getSession, refreshSession } from '@/utils/redis/sessions'
import { userService } from '@/modules/users/user.service'

const userSetter = async (req: any, res: Response, next: NextFunction) => {
    try{
        const token = req.cookies.token

        if (!token) {
            req.user_me = null
            next()
        }else{
            let decoded: any
    
            try {
                decoded = jwt.verify(token, env.JWT_SECRET)
            } catch (err) {
                req.user_me = null
                next()
            }

            if(!await userService.getById(decoded.user.id)) {
                req.user_me = null
                next()
            }
    
            if (!decoded || !decoded.session_id) {
                req.user_me = null
                next()
            }
        
            const session = await getSession(decoded.session_id)
            if (!session) {
                req.user_me = null
                next()
            }
        
            req.user_me = decoded.user
            req.session = decoded.session_id
            next()
        }
   
    }catch(error){
        next(error)
    }
}

export { userSetter }