import { Router } from 'express'
import { meController } from './me.controller'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { meAuthRequired } from '@/middlewares/authRequired'

const router = Router()

router.get('', asyncHandler(meAuthRequired), asyncHandler(meController.me))

export default router