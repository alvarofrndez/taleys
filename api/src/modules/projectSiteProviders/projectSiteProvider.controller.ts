import { NextFunction, Response } from 'express'
import { projectSiteProviderService } from './projectSiteProvider.service'

export const projectSiteProviderController = {
    getAll: async (req: any, res: Response, next: NextFunction) => {
        const project_site_providers = await projectSiteProviderService.getAll()

        res.status(200).json({
            success: true,
            data: project_site_providers,
            message: 'Proveedores de sitios de proyectos obtenidos'
        })
    }
}