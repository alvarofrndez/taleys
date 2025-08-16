import { Router } from 'express'
import { projectSiteProviderController } from './projectSiteProvider.controller'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { authRequired } from '@/middlewares/authRequired'

const router = Router()

// Ruta: /api/v1/projectSiteProviders
router.get('', asyncHandler(authRequired), asyncHandler(projectSiteProviderController.getAll))


export default router