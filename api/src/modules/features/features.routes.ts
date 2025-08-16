import { Router } from 'express'
import { featuresController } from './features.controller'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { authRequired } from '@/middlewares/authRequired'

const router = Router()

router.get('', asyncHandler(authRequired), asyncHandler(featuresController.feature))

export default router