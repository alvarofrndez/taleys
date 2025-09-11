import { Router } from 'express'
import { universeController } from './universe.controller'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { authRequired } from '@/middlewares/authRequired'
import { userSetter } from '@/middlewares/userSetter'
import { upload } from '@/utils/images/upload'
import { projectRequired } from '@/middlewares/projectRequired'
import { universeRequired } from '@/middlewares/universeRequired'
import { userRequired } from '@/middlewares/userRequired'

const router = Router({ mergeParams: true })

// Ruta: /api/v1/projects/:project_id/universes
router.get('/slug/:universe_slug', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(universeController.getBySlug))
router.get('/:universe_id/lite', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(universeRequired), asyncHandler(universeController.getByIdLite))
router.get('/:universe_id', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(universeRequired), asyncHandler(universeController.getById))
router.get('', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(universeController.getAllByProject))
router.post('', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(universeController.create))
router.put('/:universe_id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(universeRequired), asyncHandler(universeController.update))
router.delete('/:universe_id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(universeRequired), asyncHandler(universeController.delete))

export default router