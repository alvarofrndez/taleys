import { Router } from 'express'
import { authController } from './auth.controller'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { authRequired } from '@/middlewares/authRequired'
import { roleRequired } from '@/middlewares/roleRequired'

const router = Router()

router.post('/sign-in', asyncHandler(authController.signIn))
router.post('/login', asyncHandler(authController.login))
router.get('/logout', asyncHandler(authRequired), asyncHandler(authController.logout))
router.post('/github/callback', asyncHandler(authController.loginWithGithub))
router.get('/autorizado', asyncHandler(authRequired), asyncHandler(roleRequired('user')), asyncHandler(authController.autorizado))
// router.get('/', userController.getAll)

export default router