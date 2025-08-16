import { NextFunction, Response } from 'express'
import { projectCategoryTypeService } from './projectCategoryType.service'

export const projectCategoryTypeController = {
    getAll: async (req: any, res: Response, next: NextFunction) => {
        const project_category_types = await projectCategoryTypeService.getAll()

        res.status(200).json({
            success: true,
            data: project_category_types,
            message: 'Tipos de categorias de proyectos obtenidos'
        })
    }
}