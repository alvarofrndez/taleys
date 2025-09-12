import { Router } from 'express'
import { sagaController } from './saga.controller'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { authRequired } from '@/middlewares/authRequired'
import { userSetter } from '@/middlewares/userSetter'
import { projectRequired } from '@/middlewares/projectRequired'
import { sagaRequired } from '@/middlewares/sagaRequired'
import { projectVisibility } from '@/middlewares/projectVisibility'

const router = Router({ mergeParams: true })

// Ruta: /api/v1/projects/:project_id/sagas
router.get('/slug/:saga_slug', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(sagaController.getBySlug))
router.get('/:saga_id/lite', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(sagaRequired), asyncHandler(sagaController.getByIdLite))
router.get('/:saga_id', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(sagaRequired), asyncHandler(sagaController.getById))
router.get('', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(sagaController.getAllByProject))
router.post('', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(sagaController.create))
router.put('/:saga_id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(sagaRequired), asyncHandler(sagaController.update))
router.delete('/:saga_id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(sagaRequired), asyncHandler(sagaController.delete))

// Ruta /api/v1/projects/:project_id/sagas/universes/:universe_slug/sagas/slug/:saga_slug
router.get('/universes/:universe_slug/sagas/slug/:saga_slug', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(sagaController.getByProjectAndUniverseSlugAndSlug))

export default router