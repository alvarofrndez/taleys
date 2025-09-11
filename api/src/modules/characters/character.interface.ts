import { IBook } from "@/modules/books/book.interface"
import { IProject } from "@/modules/projects/project.interface"
import { ISaga } from "@/modules/sagas/saga.interface"
import { IUniverse } from "@/modules/universes/universe.interface"

export type CharacterBelongingLevel = 'project' | 'universe' | 'saga' | 'book'
export const CharacterBelongingLevel = {
  project: 'project',
  universe: 'universe',
  saga: 'saga',
  book: 'book',
} as const

export type CharacterStatus = 'alive' | 'dead' | 'unknown'
export const CharacterStatus = {
  alive: 'alive',
  dead: 'dead',
  unknown: 'unknown',
} as const

export interface ICharacterRelationshipInput {
    related_character_id: number
    relation_type: string
    note?: string
}

export interface ICharacterTimelineEventInput {
    book_id?: number | null
    event_order: number
    title: string
    description?: string
}

export interface ICharacterAppearanceInput {
  book_ids: number[]
}

export interface ICharacter {
    id?: number
    project_id?: number
    name: string
    slug: string
    alias?: string
    age?: string
    gender?: string
    race_species?: string
    status?: CharacterStatus
    image_url?: string | null

    belonging_level: CharacterBelongingLevel
    belonging_id: number
    belonging_object: IProject | IUniverse | ISaga | IBook

    biography?: string
    motivations?: string
    objectives?: string
    fears?: string
    strengths?: string
    weaknesses?: string
    profession?: string

    physical_description?: string
    abilities?: string
    limitations?: string

    appearances?: number[]
}

