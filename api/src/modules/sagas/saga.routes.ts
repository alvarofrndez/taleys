import { Router } from 'express'
import { sagaController } from './saga.controller'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { authRequired } from '@/middlewares/authRequired'
import { userSetter } from '@/middlewares/userSetter'
import { projectRequired } from '@/middlewares/projectRequired'
import { sagaRequired } from '@/middlewares/sagaRequired'

const router = Router({ mergeParams: true })

// Ruta: /api/v1/projects/:project_id/sagas
router.get('/name/:saga_name', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(sagaController.getByName))
router.get('/:saga_id/lite', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(sagaRequired), asyncHandler(sagaController.getByIdLite))
router.get('/:saga_id', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(sagaRequired), asyncHandler(sagaController.getById))
router.get('', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(sagaController.getAllByProject))
router.post('', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(sagaController.create))
router.put('/:saga_id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(sagaRequired), asyncHandler(sagaController.update))
router.delete('/:saga_id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(sagaRequired), asyncHandler(sagaController.delete))

// Ruta /api/v1/projects/:project_id/sagas/universes/:universe_name/sagas/name/:saga_name
router.get('/universes/:universe_name/sagas/name/:saga_name', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(sagaController.getByProjectAndUniverseNameAndName))

export default router