import { Router } from 'express'
import { projectCategoryTypeController } from './projectCategoryType.controller'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { authRequired } from '@/middlewares/authRequired'

const router = Router()

// Ruta: /api/v1/projectCategoryTypes
router.get('', asyncHandler(authRequired), asyncHandler(projectCategoryTypeController.getAll))


export default router