import { Router } from 'express'
import { securityController } from './security.controller'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { authRequired } from '@/middlewares/authRequired'

const router = Router()

router.get('', asyncHandler(authRequired), asyncHandler(securityController.has2faActive))
router.get('/generate-2fa', asyncHandler(authRequired), asyncHandler(securityController.generate2fa))
router.post('/enable-2fa', asyncHandler(authRequired), asyncHandler(securityController.enable2fa))
router.get('/generateBackupCodes', asyncHandler(authRequired), asyncHandler(securityController.generateBackupCodes))
router.get('/disable-2fa', asyncHandler(authRequired), asyncHandler(securityController.disable2fa))
router.post('/verifyTotp', asyncHandler(authRequired), asyncHandler(securityController.verifyTotp))
router.post('/verifyBackup', asyncHandler(authRequired), asyncHandler(securityController.verifyBackup))
router.post('/changePassword', asyncHandler(authRequired), asyncHandler(securityController.changePassword))

export default router