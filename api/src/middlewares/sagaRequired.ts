import { Response, NextFunction } from 'express'
import { env } from '@/config/config_env'
import CustomError from '@/modules/customerror/CustomError'
import { sagaService } from '@/modules/sagas/saga.service'

const sagaRequired = async (req: any, res: Response, next: NextFunction) => {
    try{
        const { saga_id } = req.params
    
        const saga = await sagaService.getByIdLite(saga_id)
        if (!saga) throw new CustomError('No se encontró la saga', 404, env.DATA_NOT_FOUND_CODE)

        req.saga = saga
        next()
    }catch(error){
        next(error)
    }
}

export { sagaRequired }