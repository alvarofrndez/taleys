import { Response, NextFunction } from 'express'
import CustomError from '@/modules/customError/CustomError'

const selfRequired = async (req: any, res: Response, next: NextFunction) => {
    try{
        if(req.params.user_id != req.user_me.id) throw new CustomError('No puedes actualizar este usuario', 403)

        next()
    }catch(error){
        next(error)
    }
}

export { selfRequired }