import { Router } from 'express'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { characterController } from './character.controller'
import { projectRequired } from '@/middlewares/projectRequired'
import { projectVisibility } from '@/middlewares/projectVisibility'
import { userSetter } from '@/middlewares/userSetter'
import { authRequired } from '@/middlewares/authRequired'

const router = Router({ mergeParams: true })

// Ruta: /projects/:project_id/characters
router.post('', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.create))
router.get('', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.list))
router.get('/:id', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.getById))
router.get('/slug/:slug', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.getBySlug))
router.put('/:id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.update))
router.delete('/:id', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.delete))

router.post('/:id/appearances', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.addAppearances))
router.get('/:id/appearances', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.listAppearances))

router.put('/:id/timeline', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.setTimeline))
router.get('/:id/timeline', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.getTimeline))

router.post('/:id/relationships', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.addRelationship))
router.get('/:id/relationships', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.listRelationships))

export default router
