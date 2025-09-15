import { Request, Response, NextFunction } from 'express'
import { characterService } from './character.service'
import CustomError from '@/modules/customerror/CustomError'
import { env } from '@/config/config_env'

export const characterController = {
    create: async (req: Request, res: Response, next: NextFunction) => {
        const { project_id } = req.params as any
        const data = req.body
        const character = await characterService.create(project_id, data)
        res.status(201).json({ success: true, data: character, message: 'Personaje creado' })
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params as any
        const character = await characterService.getById(Number(id))
        res.status(200).json({ success: true, data: character, message: 'Personaje obtenido' })
    },

    getBySlug: async (req: Request, res: Response, next: NextFunction) => {
        const { slug } = req.params as any
        const character = await characterService.getBySlug(slug)
        res.status(200).json({ success: true, data: character, message: 'Personaje obtenido' })
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params as any
        const data = req.body
        const character = await characterService.update(Number(id), data)
        res.status(200).json({ success: true, data: character, message: 'Personaje actualizado' })
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params as any
        await characterService.delete(Number(id))
        res.status(200).json({ success: true, message: 'Personaje eliminado' })
    },

    list: async (req: Request, res: Response, next: NextFunction) => {
        const { project_id, universe_id, saga_id, book_id } = req.params as any

        let level: string | null = null
        let belongingId: number | null = null

        if (universe_id) { level = 'universe'; belongingId = Number(universe_id) }
        else if (saga_id) { level = 'saga'; belongingId = Number(saga_id) }
        else if (book_id) { level = 'book'; belongingId = Number(book_id) }
        else if (project_id) { level = 'project'; belongingId = Number(project_id) }

        const list = await characterService.listByBelonging(level!, belongingId!)
        res.status(200).json({ success: true, data: list, message: 'Personajes obtenidos' })
    },

    addAppearance: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params as any
        const data = req.body
        const inserted = await characterService.addAppearance(Number(id), data)
        res.status(200).json({ success: true, data: inserted, message: `Aparición añadida` })
    },

    addAppearances: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params as any
        const data = req.body
        const inserted = await characterService.addAppearances(Number(id), data)
        res.status(200).json({ success: true, data: inserted, message: `Aparici${inserted.length == 1 ? 'ó' : 'o'}n${inserted.length == 1 ? '' : 'es'} añadida${inserted.length == 1 ? '' : 's'}` })
    },

    updateAppearance: async (req: Request, res: Response, next: NextFunction) => {
        const { id, appearance_id } = req.params as any
        const data = req.body
        const inserted = await characterService.updateAppearance(Number(id), Number(appearance_id), data)
        res.status(200).json({ success: true, data: inserted, message: `Aparición actualizada` })
    },

    listAppearances: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params as any
        const appearances = await characterService.listAppearances(Number(id))
        res.status(200).json({ success: true, data: appearances, message: 'Apariciones obtenidas' })
    },

    deleteAppearance: async (req: Request, res: Response, next: NextFunction) => {
        const { appearance_id } = req.params as any
        const deleted = await characterService.deleteAppearance(Number(appearance_id))
        
        if (deleted) {
            res.status(200).json({
                success: true,
                message: 'Aparición eliminada'
            })
        } else {
            throw new CustomError('Error al eliminar la aparición', 400, env.INVALID_DATA_CODE)
        }
    },

    setTimeline: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params as any
        const events = req.body
        const timeline = await characterService.setTimeline(Number(id), events)
        res.status(200).json({ success: true, data: timeline, message: 'Línea temporal actualizada' })
    },

    getTimeline: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params as any
        const timeline = await characterService.getTimeline(Number(id))
        res.status(200).json({ success: true, data: timeline, message: 'Línea temporal obtenida' })
    },

    addRelationship: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params as any
        const rel = req.body
        const relationship = await characterService.addRelationship(Number(id), rel)
        res.status(200).json({ success: true, data: relationship, message: 'Relación creada' })
    },

    listRelationships: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params as any
        const relationships = await characterService.listRelationships(Number(id))
        res.status(200).json({ success: true, data: relationships, message: 'Relaciones obtenidas' })
    },

    updateRelationship: async (req: Request, res: Response, next: NextFunction) => {
        const { id, relationship_id } = req.params as any
        const data = req.body
        const inserted = await characterService.updateRelationship(Number(id), Number(relationship_id), data)
        res.status(200).json({ success: true, data: inserted, message: `Relación actualizada` })
    },

    deleteRelationship: async (req: Request, res: Response, next: NextFunction) => {
        const { relationship_id } = req.params as any
        const deleted = await characterService.deleteRelationship(Number(relationship_id))
        
        if (deleted) {
            res.status(200).json({
                success: true,
                message: 'Relación eliminada'
            })
        } else {
            throw new CustomError('Error al eliminar la relación', 400, env.INVALID_DATA_CODE)
        }
    },
}