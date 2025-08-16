import { Router } from 'express'
import { sagaUniverseController } from './saga.controller'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { authRequired } from '@/middlewares/authRequired'
import { userSetter } from '@/middlewares/userSetter'
import { upload } from '@/utils/images/upload'
import { projectRequired } from '@/middlewares/projectRequired'
import { universeRequired } from '@/middlewares/universeRequired'
import { sagaRequired } from '@/middlewares/sagaRequired'

const router = Router({ mergeParams: true })

// Ruta: /api/v1/projects/:project_id/universes/:universe_id/sagas
router.get('/name/:saga_name', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(universeRequired), asyncHandler(sagaUniverseController.getByName))
router.get('/:saga_id/lite', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(universeRequired), asyncHandler(sagaRequired), asyncHandler(sagaUniverseController.getByIdLite))
router.get('/:saga_id', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(universeRequired), asyncHandler(sagaRequired), asyncHandler(sagaUniverseController.getById))
router.get('', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(universeRequired), asyncHandler(sagaUniverseController.getAllByUniverse))
router.post('', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(universeRequired), asyncHandler(sagaUniverseController.create))
router.put('/:saga_id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(universeRequired), asyncHandler(sagaRequired), asyncHandler(sagaUniverseController.update))
router.delete('/:saga_id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(universeRequired), asyncHandler(sagaRequired), asyncHandler(sagaUniverseController.delete))

export default router