import { Response, NextFunction } from 'express'
import { env } from '@/config/config_env'
import CustomError from '@/modules/customerror/CustomError'
import { projectService } from '@/modules/projects/project.service'
import { projectMemberService } from '@/modules/projectMembers/projectMember.service'

const projectVisibility = async (req: any, res: Response, next: NextFunction) => {
    try{
        const project_id = req.project.id
        let project = {... req.project}
    
        project.members = await projectMemberService.getAllByProject(project_id)

        const can_res = projectService.checkVisibility(project, req)

        if(can_res){
            next()
        }else{
            throw new CustomError('El proyecto no existe', 404, env.DATA_NOT_FOUND_CODE)
        }

    }catch(error){
        next(error)
    }
}

export { projectVisibility }