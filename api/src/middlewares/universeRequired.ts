import { Response, NextFunction } from 'express'
import { env } from '@/config/config_env'
import CustomError from '@/modules/customerror/CustomError'
import { universeService } from '@/modules/universes/universe.service'

const universeRequired = async (req: any, res: Response, next: NextFunction) => {
    try{
        const { universe_id } = req.params
    
        const universe = await universeService.getByIdLite(universe_id)
        if (!universe) throw new CustomError('No se encontró el universo', 404, env.DATA_NOT_FOUND_CODE)

        req.universe = universe
        next()
    }catch(error){
        next(error)
    }
}

export { universeRequired }