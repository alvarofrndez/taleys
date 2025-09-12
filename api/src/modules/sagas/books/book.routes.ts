import { Router } from 'express'
import { bookSagaController } from './book.controller'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { authRequired } from '@/middlewares/authRequired'
import { userSetter } from '@/middlewares/userSetter'
import { upload } from '@/utils/images/upload'
import { projectRequired } from '@/middlewares/projectRequired'
import { sagaRequired } from '@/middlewares/sagaRequired'
import { bookRequired } from '@/middlewares/bookRequired'
import { projectVisibility } from '@/middlewares/projectVisibility'

const router = Router({ mergeParams: true })

// Ruta: /api/v1/projects/:project_id/sagas/:saga_id/books
router.get('/name/:book_title', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(sagaRequired), asyncHandler(bookSagaController.getByTitle))
router.get('/:book_id/lite', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(sagaRequired), asyncHandler(bookRequired), asyncHandler(bookSagaController.getByIdLite))
router.get('/:book_id', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(sagaRequired), asyncHandler(bookRequired), asyncHandler(bookSagaController.getById))
router.get('', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(sagaRequired), asyncHandler(bookSagaController.getAllBySaga))
router.post('', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(sagaRequired), asyncHandler(bookSagaController.create))
router.put('/:book_id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(sagaRequired), asyncHandler(bookRequired), asyncHandler(bookSagaController.update))
router.delete('/:book_id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(sagaRequired), asyncHandler(bookRequired), asyncHandler(bookSagaController.delete))

export default router