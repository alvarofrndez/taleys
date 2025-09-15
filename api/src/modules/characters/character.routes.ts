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
router.post('/:id/appearances/single', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.addAppearance))
router.get('/:id/appearances', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.listAppearances))
router.put('/:id/appearances/:appearance_id', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.updateAppearance))
router.delete('/:id/appearances/:appearance_id', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.deleteAppearance))

router.put('/:id/timeline', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.setTimeline))
router.get('/:id/timeline', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.getTimeline))

router.post('/:id/relationships', asyncHandler(authRequired), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.addRelationship))
router.get('/:id/relationships', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.listRelationships))
router.put('/:id/relationships/:relationship_id', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.updateRelationship))
router.delete('/:id/relationships/:relationship_id', asyncHandler(userSetter), asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.deleteRelationship))

export default router
