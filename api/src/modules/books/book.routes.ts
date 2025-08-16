import { Router } from 'express'
import { bookController } from './book.controller'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { authRequired } from '@/middlewares/authRequired'
import { userSetter } from '@/middlewares/userSetter'
import { projectRequired } from '@/middlewares/projectRequired'
import { bookRequired } from '@/middlewares/bookRequired'

const router = Router({ mergeParams: true })

// Ruta: /api/v1/projects/:project_id/books
router.get('/name/:book_title', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(bookController.getByTitle))
router.get('/:book_id/lite', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(bookRequired), asyncHandler(bookController.getByIdLite))
router.get('/:book_id', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(bookRequired), asyncHandler(bookController.getById))
router.get('', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(bookController.getAllByProject))
router.post('', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(bookController.create))
router.put('/:book_id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(bookRequired), asyncHandler(bookController.update))
router.delete('/:book_id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(bookRequired), asyncHandler(bookController.delete))

// Ruta /api/v1/projects/:project_id/books/universes/:universe_name/books/name/:book_title
router.get('/universes/:universe_name/books/name/:book_title', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(bookController.getByProjectAndUniverseNameAndTitle))

// Ruta /api/v1/projects/:project_id/books/universes/:universe_name/sagas/:sag_name/books/name/:book_title
router.get('/universes/:universe_name/sagas/:saga_name/books/name/:book_title', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(bookController.getByProjectAndUniverseNameAndSagaNameAndTitle))

export default router