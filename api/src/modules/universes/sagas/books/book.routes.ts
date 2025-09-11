import { Router } from 'express'
import { bookSagaUniverseController } from './book.controller'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { authRequired } from '@/middlewares/authRequired'
import { userSetter } from '@/middlewares/userSetter'
import { upload } from '@/utils/images/upload'
import { projectRequired } from '@/middlewares/projectRequired'
import { universeRequired } from '@/middlewares/universeRequired'
import { sagaRequired } from '@/middlewares/sagaRequired'
import { bookRequired } from '@/middlewares/bookRequired'

const router = Router({ mergeParams: true })

// Ruta: /api/v1/projects/:project_id/universes/:universe_id/sagas/:saga_id/books
router.get('/name/:book_title', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(universeRequired), asyncHandler(sagaRequired), asyncHandler(bookSagaUniverseController.getByTitle))
router.get('/:book_id/lite', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(universeRequired), asyncHandler(sagaRequired), asyncHandler(bookRequired), asyncHandler(bookSagaUniverseController.getByIdLite))
router.get('/:book_id', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(universeRequired), asyncHandler(sagaRequired), asyncHandler(bookRequired), asyncHandler(bookSagaUniverseController.getById))
router.get('', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(universeRequired), asyncHandler(sagaRequired), asyncHandler(bookSagaUniverseController.getAllBySaga))
router.post('', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(universeRequired), asyncHandler(sagaRequired), asyncHandler(bookSagaUniverseController.create))
router.put('/:book_id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(universeRequired), asyncHandler(sagaRequired), asyncHandler(bookRequired), asyncHandler(bookSagaUniverseController.update))
router.delete('/:book_id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(universeRequired), asyncHandler(sagaRequired), asyncHandler(bookRequired), asyncHandler(bookSagaUniverseController.delete))


export default router