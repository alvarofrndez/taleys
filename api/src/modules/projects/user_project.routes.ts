import { Router } from 'express'
import { projectController } from './project.controller'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { authRequired } from '@/middlewares/authRequired'
import { userRequired } from '@/middlewares/userRequired'
import { projectRequired } from '@/middlewares/projectRequired'

const router = Router()

// Ruta: /api/v1/users/:user_id/projects
router.get('/users/:user_id/projects', asyncHandler(authRequired), asyncHandler(userRequired), asyncHandler(projectController.getAllByUser))

export default router