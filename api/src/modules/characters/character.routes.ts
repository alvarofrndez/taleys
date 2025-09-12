import { Router } from 'express'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { characterController } from './character.controller'
import { projectRequired } from '@/middlewares/projectRequired'
import { projectVisibility } from '@/middlewares/projectVisibility'

const router = Router({ mergeParams: true })

// Ruta: /projects/:project_id/characters
router.post('', asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.create))
router.get('', asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.list))
router.get('/:id', asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.getById))
router.get('/slug/:slug', asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.getBySlug))
router.put('/:id', asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.update))
router.delete('/:id', asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.delete))

router.post('/:id/appearances', asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.addAppearances))
router.get('/:id/appearances', asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.listAppearances))

router.put('/:id/timeline', asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.setTimeline))
router.get('/:id/timeline', asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.getTimeline))

router.post('/:id/relationships', asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.addRelationship))
router.get('/:id/relationships', asyncHandler(projectRequired), asyncHandler(projectVisibility), asyncHandler(characterController.listRelationships))

export default router
