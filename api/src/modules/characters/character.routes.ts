import { Router } from 'express'
import { asyncHandler } from '@/middlewares/asyncHandler'
import { characterController } from './character.controller'

const router = Router({ mergeParams: true })

// Ruta: /projects/:project_id/characters
router.post('', asyncHandler(characterController.create))
router.get('', asyncHandler(characterController.list))
router.get('/:id', asyncHandler(characterController.getById))
router.get('/slug/:slug', asyncHandler(characterController.getBySlug))
router.put('/:id', asyncHandler(characterController.update))
router.delete('/:id', asyncHandler(characterController.delete))

router.post('/:id/appearances', asyncHandler(characterController.addAppearances))
router.get('/:id/appearances', asyncHandler(characterController.listAppearances))

router.put('/:id/timeline', asyncHandler(characterController.setTimeline))
router.get('/:id/timeline', asyncHandler(characterController.getTimeline))

router.post('/:id/relationships', asyncHandler(characterController.addRelationship))
router.get('/:id/relationships', asyncHandler(characterController.listRelationships))

export default router
