import { Router } from 'express'
import { projectController } from './project.controller'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { authRequired } from '@/middlewares/authRequired'
import { userSetter } from '@/middlewares/userSetter'
import { upload } from '@/utils/images/upload'
import { projectRequired } from '@/middlewares/projectRequired'
import { userRequired } from '@/middlewares/userRequired'

const router = Router()

// Ruta: /api/v1/projects
router.get('/name/:project_name/users/:user_id', asyncHandler(authRequired), asyncHandler(userRequired), asyncHandler(projectController.getByUserAndName))
router.get('/name/:project_name/users/username/:username', asyncHandler(authRequired), asyncHandler(projectController.getByUserUsernameAndName))
router.get('/name/:project_name', asyncHandler(userSetter), asyncHandler(projectController.getAllByName))
router.get('/slug/:project_slug', asyncHandler(userSetter), asyncHandler(projectController.getBySlug))
router.get('/slug/:project_slug/users/:user_id', asyncHandler(authRequired), asyncHandler(userRequired), asyncHandler(projectController.getByUserAndSlug))
router.get('/slug/:project_slug/users/username/:username', asyncHandler(authRequired), asyncHandler(projectController.getByUserUsernameAndSlug))
router.get('/:project_id/lite', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectController.getByIdLite))
router.get('/:project_id', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectController.getById))
router.post('/:project_id/save', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectController.save))
router.post('/:project_id/like', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectController.like))
router.post('', asyncHandler(authRequired), asyncHandler(projectController.create))
router.put('/:project_id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectController.update))
router.delete('/:project_id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectController.delete))

export default router