import { Router } from 'express'
import { featuresController } from './resetPassword.controller'
import { asyncHandler } from '@/middlewares/asyncHandler'

const router = Router()

router.post('/forgot-password', asyncHandler(featuresController.forgotPassword))
router.post('/validate-token', asyncHandler(featuresController.validateToken))
router.post('', asyncHandler(featuresController.resetPassword))

export default router