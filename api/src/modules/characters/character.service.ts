import { env } from '@/config/config_env'
import CustomError from '@/modules/customerror/CustomError'
import { characterModel } from './Character'
import { ICharacter, ICharacterAppearanceInput, ICharacterRelationshipInput, ICharacterTimelineEventInput } from './character.interface'
import { bookService } from '@/modules/books/book.service'
import { generateUniqueSlug } from '@/utils/slugify'
import { CharacterBelongingLevel } from '@/modules/characters/character.interface'
import { sagaService } from '@/modules/sagas/saga.service'
import { universeService } from '@/modules/universes/universe.service'
import { projectService } from '@/modules/projects/project.service'

export const characterService = {
    getById: async (id: number) => {
        const character = await characterModel.getById(id)
        if(!character) throw new CustomError('El personaje no existe', 404, env.DATA_NOT_FOUND_CODE)
        
        return await characterService.getAllData(character)
    },

    getByIdLite: async (id: number) => {
        const character = await characterModel.getById(id)
        if(!character) throw new CustomError('El personaje no existe', 404, env.DATA_NOT_FOUND_CODE)
        
        return character
    },

    getBySlug: async (slug: string) => {
        const character = await characterModel.getBySlug(slug)
        if(!character) throw new CustomError('El personaje no existe', 404, env.DATA_NOT_FOUND_CODE)
        
        return await characterService.getAllData(character)
    },

    getAllData: async (character: ICharacter): Promise<ICharacter> => {
        /**
         * Obtiene toda la información sobre un personaje
         */
        const character_with_all_data: ICharacter = { ...character }

        character_with_all_data.extra_attributes = await characterService.getExtraAttributes(character.id)

        const BELONGING_OBJECT_RELATION: Record<CharacterBelongingLevel, (id: number) => Promise<any>> = {
            book: async (id: number) => bookService.getByIdLiteWithParentsLite(id),
            saga: async (id: number) => sagaService.getByIdLiteWithParentsLite(id),
            universe: async (id: number) => universeService.getByIdLite(id),
            project: async (id: number) => projectService.getByIdLite(id),
        }

        if (BELONGING_OBJECT_RELATION[character_with_all_data.belonging_level]) {
            character_with_all_data.belonging_object = await BELONGING_OBJECT_RELATION[character_with_all_data.belonging_level](character_with_all_data.belonging_id)
        } else {
            character_with_all_data.belonging_object = null
        }

        character_with_all_data.relationships = await characterService.listRelationships(character.id)

        return character_with_all_data
    },

    getAllByProject: async (project_id: number) => {
        const characters = await characterModel.getAllByProject(project_id)

        const characters_with_data = await Promise.all(
            characters.map(c => characterService.getAllData(c))
        )

        return characters_with_data
    },

    listByBelonging: async (belonging_level: string, belonging_id: number) => {
        const characters:ICharacter[] = await characterModel.listByBelonging(belonging_level, belonging_id)

        const characters_with_data = await Promise.all(
            characters.map(c => characterService.getAllData(c))
        )

        return characters_with_data
    },

    create: async (project_id: number, data: ICharacter) => {
        data.slug = await generateUniqueSlug(data.name as string, async (slug: string) => {
            const existing_character = await characterModel.getByBelongingAndSlug(data.belonging_level, data.belonging_id, slug)
            return !!existing_character
        })

        const error_message = characterService.checkCreateData(data)
        if(typeof error_message === 'string') throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)

        await characterService.validateBelonging(data.belonging_level, data.belonging_id, data.name)

        const created = await characterModel.create(project_id, data)

        if(data.extra_attributes && data.extra_attributes.length){
            await characterService.addExtraAttributes(created.id as number, data.extra_attributes)
        }

        if(data.appearances && data.appearances.length){
            await characterService.addAppearances(created.id as number, { book_ids: data.appearances })
        }

        return await characterService.getById(created.id as number)
    },

    update: async (id: number, data: Partial<ICharacter>) => {
        const exists = await characterService.getById(id)

        if (data.name && data.name != exists.name) {
            data.slug = await generateUniqueSlug(data.name, async (slug: string) => {
                const existing_character = await characterModel.getByBelongingAndSlug(
                    exists.belonging_level,
                    exists.belonging_id,
                    slug
                )
                return !!existing_character
            })
        } else {
            data.slug = exists.slug
        }

        const error_message = characterService.checkUpdateData(data)
        if (typeof error_message === 'string') {
            throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)
        }

        if (exists && (id != exists.id || data.name != exists.name)) {
            await characterService.validateBelonging(
                exists.belonging_level,
                exists.belonging_id,
                data.name as string
            )
        }

        await characterModel.update(id, data)

        await characterService.updateAllExtraAttributes(id, data.extra_attributes, exists.extra_attributes)

        return await characterService.getById(id)
    },

    delete: async (id: number) => {
        await characterService.getById(id)
        
        const appearances = await characterModel.listAppearances(id)
        if (appearances.length) {
            await characterModel.deleteAppearances(id)
        }

        const timeline = await characterModel.getTimeline(id)
        if (timeline.length) {
            await characterModel.clearTimeline(id)
        }

        const relationships = await characterModel.listRelationships(id)
        if (relationships.length) {
            await characterModel.deleteRelationships(id)
        }
        await characterModel.deleteRelatedRelationships(id)

        await characterService.deleteAllExtraAttributes(id)

        await characterModel.delete(id)

        return true
    },

    clearAllByBelonging: async (belonging_level: CharacterBelongingLevel, belonging_id: number) => {
        /**
         * Limpia todos los datos referentes a todos los personajes pertenecientes al `belonging_level` y su `belonging_id`.
         * 
         * Pasos:
         * 1. Elimina todos los personajes que pertenecen directamente a ese nivel.
         * 2. Elimina todas las apariciones en ese nivel de personajes que no pertenecen directamente a ese nivel.
         */
        const characters = await characterModel.listByBelonging(belonging_level, belonging_id)

        for (const character of characters) {
            await characterModel.delete(character.id)
        }

        if (belonging_level === CharacterBelongingLevel.book) {
            await characterModel.deleteAppearancesByBook(belonging_id)
        }

        return true
    },

    addExtraAttributes: async (character_id: number, extra_attributes: any[]) => {
        await characterService.getByIdLite(character_id)
        return await characterModel.addExtraAttributes(character_id, extra_attributes)
    },

    updateAllExtraAttributes: async (character_id: number, new_extra_attributes: any[], old_extra_attributes: any[]) => {
        const old_map = new Map(old_extra_attributes.map(attr => [attr.key, attr.value]))
        const new_map = new Map(new_extra_attributes.map(attr => [attr.key, attr.value]))

        const to_insert: any[] = []
        const to_update: any[] = []
        const to_delete: string[] = []

        for (const [key, value] of new_map.entries()) {
            if (!old_map.has(key)) {
                to_insert.push({ key, value })
            } else if (old_map.get(key) !== value) {
                to_update.push({ key, value })
            }
        }

        for (const [key] of old_map.entries()) {
            if (!new_map.has(key)) {
                to_delete.push(key)
            }
        }

        const results: any = {}

        if (to_insert.length > 0) {
            results.inserted = await characterModel.addExtraAttributes(character_id, to_insert)
        }

        if (to_update.length > 0) {
            results.updated = await characterModel.updateExtraAttributes(character_id, to_update)
        }

        if (to_delete.length > 0) {
            results.deleted = await characterModel.deleteExtraAttributes(character_id, to_delete)
        }

        return results
    },

    deleteExtraAttribute: async (character_id: number, key: string) => {
        await characterService.getByIdLite(character_id)
        return await characterModel.deleteExtraAttribute(character_id, key)
    },
    
    deleteAllExtraAttributes: async (character_id: number) => {
        await characterService.getByIdLite(character_id)
        return await characterModel.deleteAllExtraAttributes(character_id)
    },

    getExtraAttributes: async (character_id: number) => {
        await characterService.getByIdLite(character_id)
        return await characterModel.getExtraAttributes(character_id)
    },

    addAppearances: async (character_id: number, data: ICharacterAppearanceInput) => {
        if(!Array.isArray(data.book_ids)) throw new CustomError('appearances debe ser un array de ids de libros', 400, env.INVALID_DATA_CODE)
        if(data.book_ids.length === 0) return []
        for(const book_id of data.book_ids){
            await bookService.getByIdLite(book_id)
        }
        return await characterModel.addAppearances(character_id, data.book_ids)
    },

    listAppearances: async (character_id: number) => {
        await characterService.getByIdLite(character_id)

        const appearances = await characterModel.listAppearances(character_id)

        for(let appearance of appearances){
            appearance.book = await bookService.getByIdLite(appearance.book_id)
        }

        return appearances
    },

    setTimeline: async (character_id: number, events: ICharacterTimelineEventInput[]) => {
        await characterService.getByIdLite(character_id)
        const error_message = characterService.checkTimeline(events)
        if(typeof error_message === 'string') throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)
        await characterModel.setTimeline(character_id, events)
        return await characterModel.getTimeline(character_id)
    },

    getTimeline: async (character_id: number) => {
        await characterService.getByIdLite(character_id)
        return await characterModel.getTimeline(character_id)
    },

    getRelationshipById: async (id: number) => {
        const relationship = await characterModel.getRelationshipById(id)

        if(!relationship) throw new CustomError('La relación no existe', 404, env.DATA_NOT_FOUND_CODE)

        return relationship 
    },

    addRelationship: async (character_id: number, rel: ICharacterRelationshipInput) => {
        await characterService.getByIdLite(character_id)
        await characterService.getByIdLite(rel.related_character_id)
        if(!rel.relation_type || !rel.relation_type.trim()) throw new CustomError('relation_type es requerido', 400, env.INVALID_DATA_CODE)
        return await characterModel.addRelationship(character_id, rel.related_character_id, rel.relation_type, rel.note)
    },

    deleteRelationship: async (relationship_id: number) => {
        await characterService.getRelationshipById(relationship_id)

        return await characterModel.deleteRelationship(relationship_id)
    },

    listRelationships: async (character_id: number) => {
        const relationships: ICharacterRelationshipInput[] = await characterModel.listRelationships(character_id)

        let final_relationships = []
        for(let relationship of relationships){
            final_relationships.push({ ...relationship, related_character: await characterService.getByIdLite(relationship.related_character_id)})
        }

        return final_relationships
    },

    checkCreateData: (data: ICharacter) => {
        if(!data.name || !data.name.trim()) return 'El nombre no puede estar vacío'
        if(data.slug && !data.slug.trim()) return 'El slug no puede estar vacío'
        if(!data.belonging_level) return 'Nivel de dependencia es requerido'
        if(!data.belonging_id) return 'El nivel de dependencia es requerido'
        const allowed_levels = ['project','universe','saga','book']
        if(!allowed_levels.includes(data.belonging_level)) return 'Nivel de dependencia inválido'
        if(data.appearances && !Array.isArray(data.appearances)) return 'appearances debe ser un array'
        return true
    },

    checkUpdateData: (data: Partial<ICharacter>) => {
        if(data.belonging_level && !['project','universe','saga','book'].includes(data.belonging_level)) return 'Nivel de dependencia inválido'
        if(data.slug && !data.slug.trim()) return 'El slug no puede estar vacío'
        return true
    },

    checkTimeline: (events: ICharacterTimelineEventInput[]) => {
        if(!Array.isArray(events)) return 'timeline debe ser un array de eventos'
        for(const e of events){
            if(typeof e.event_order !== 'number') return 'event_order debe ser numérico'
            if(!e.title || !e.title.trim()) return 'title es requerido en cada evento'
        }
        const orders = events.map(e => e.event_order)
        const hasDup = new Set(orders).size !== orders.length
        if(hasDup) return 'event_order no puede repetirse'
        return true
    },

    validateBelonging: async (level: string, id: number, name: string) => {
        // Validación básica: que exista el contenedor. Se apoya en servicios existentes.
        if(level === 'book'){
            await bookService.getByIdLite(id)

            const existingCharacter = await characterModel.getByBelonging(level, id, name)
            if(existingCharacter) throw new CustomError('Ya existe un personaje con ese nombre en este libro', 400, env.DUPLICATE_DATA_CODE)
            return true
        }
        if(level === 'saga'){
            const { sagaService } = await import('@/modules/sagas/saga.service')
            await sagaService.getByIdLite(id)
            const existingCharacter = await characterModel.getByBelonging(level, id, name)
            if(existingCharacter) throw new CustomError('Ya existe un personaje con ese nombre en esta saga', 400, env.DUPLICATE_DATA_CODE)
            return true
        }
        if(level === 'universe'){
            const { universeService } = await import('@/modules/universes/universe.service')
            await universeService.getByIdLite(id)
            const existingCharacter = await characterModel.getByBelonging(level, id, name)
            if(existingCharacter) throw new CustomError('Ya existe un personaje con ese nombre en este universo', 400, env.DUPLICATE_DATA_CODE)
            return true
        }
        if(level === 'project'){
            const { projectService } = await import('@/modules/projects/project.service')
            await projectService.getByIdLite(id)
            const existingCharacter = await characterModel.getByBelonging(level, id, name)
            if(existingCharacter) throw new CustomError('Ya existe un personaje con ese nombre en este proyecto', 400, env.DUPLICATE_DATA_CODE)
            return true
        }
        throw new CustomError('belonging_level inválido', 400, env.INVALID_DATA_CODE)
    },
}

