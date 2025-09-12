import { Router } from 'express'
import { bookUniverseController } from './book.controller'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { authRequired } from '@/middlewares/authRequired'
import { userSetter } from '@/middlewares/userSetter'
import { upload } from '@/utils/images/upload'
import { projectRequired } from '@/middlewares/projectRequired'
import { universeRequired } from '@/middlewares/universeRequired'
import { bookRequired } from '@/middlewares/bookRequired'
import { projectVisibility } from '@/middlewares/projectVisibility'

const router = Router({ mergeParams: true })

// Ruta: /api/v1/projects/:project_id/universes/:universe_id/books
router.get('/name/:book_title', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(universeRequired), asyncHandler(bookUniverseController.getByTitle))
router.get('/:book_id/lite', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(universeRequired), asyncHandler(bookRequired), asyncHandler(bookUniverseController.getByIdLite))
router.get('/:book_id', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(universeRequired), asyncHandler(bookRequired), asyncHandler(bookUniverseController.getById))
router.get('', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(universeRequired), asyncHandler(bookUniverseController.getAllByUniverse))
router.post('', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(universeRequired), asyncHandler(bookUniverseController.create))
router.put('/:book_id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(universeRequired), asyncHandler(bookRequired), asyncHandler(bookUniverseController.update))
router.delete('/:book_id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(universeRequired), asyncHandler(bookRequired), asyncHandler(bookUniverseController.delete))

export default router