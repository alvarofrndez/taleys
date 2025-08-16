import { Router } from 'express'
import { userController } from './user.controller'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { authRequired } from '@/middlewares/authRequired'
import { roleRequired } from '@/middlewares/roleRequired'
import { selfRequired } from '@/middlewares/selfRequired'
import { userSetter } from '@/middlewares/userSetter'

const router = Router()

// /users/
router.get('', asyncHandler(authRequired), asyncHandler(roleRequired('user')), asyncHandler(userController.getAll))
router.get('/:user_id', asyncHandler(authRequired), asyncHandler(userController.getById))
router.get('/username/:username', asyncHandler(userSetter), asyncHandler(userController.getByUsername))
router.put('/:user_id', asyncHandler(authRequired), asyncHandler(selfRequired), asyncHandler(userController.update))
router.get('/:user_id/follow', asyncHandler(authRequired), asyncHandler(userController.follow))

export default router