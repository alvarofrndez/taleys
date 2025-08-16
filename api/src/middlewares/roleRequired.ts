import { Response, NextFunction } from 'express'
import CustomError from '@/modules/customerror/CustomError'
import { roleService } from '@/modules/roles/role.service'
import { env } from '@/config/config_env'

const roleRequired = (type: string) => {
    return async (req: any, res: Response, next: NextFunction) => {
        try{
            const user = req.user_me
        
            if (!user) throw new CustomError('No se encontró el usuario', 401, env.UNAUTHENTICATED_CODE)
    
            const role_priority: string = await roleService.getPriorityByType(type)
            const user_role_priority: string = await roleService.getPriorityById(user.role_id)
    
            if (user_role_priority < role_priority) throw new CustomError('No tienes permiso para esta acción', 403, env.UNAUTHORIZED_CODE)
            
            next()
        }catch(error){
            next(error)
        }
    }
}

export { roleRequired }