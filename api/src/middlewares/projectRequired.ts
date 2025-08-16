import { Response, NextFunction } from 'express'
import { env } from '@/config/config_env'
import CustomError from '@/modules/customerror/CustomError'
import { projectService } from '@/modules/projects/project.service'

const projectRequired = async (req: any, res: Response, next: NextFunction) => {
    try{
        const { project_id } = req.params
    
        const project = await projectService.getByIdLite(project_id)
        if (!project) throw new CustomError('No se encontró el proyecto', 404, env.DATA_NOT_FOUND_CODE)

        req.project = project
        next()
    }catch(error){
        next(error)
    }
}

export { projectRequired }