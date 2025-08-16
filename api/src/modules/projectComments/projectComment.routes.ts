import { Router } from 'express'
import { projectCommentController } from './projectComment.controller'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { authRequired } from '@/middlewares/authRequired'
import { userRequired } from '@/middlewares/userRequired'
import { projectRequired } from '@/middlewares/projectRequired'
import { userSetter } from '@/middlewares/userSetter'

const router = Router({ mergeParams: true })

// Ruta: /api/v1/users/:user_id/projects/:project_id/comments

router.get('', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectCommentController.getAllByProject))
router.get('/:comment_id', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectCommentController.getById))
router.post('', asyncHandler(authRequired), asyncHandler(userRequired), asyncHandler(projectRequired), asyncHandler(projectCommentController.create))
router.delete('/:comment_id', asyncHandler(authRequired), asyncHandler(userRequired), asyncHandler(projectRequired), asyncHandler(projectCommentController.delete))
router.post('/:comment_id/like', asyncHandler(authRequired), asyncHandler(userRequired), asyncHandler(projectRequired), asyncHandler(projectCommentController.like))

export default router