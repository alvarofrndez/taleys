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

export interface ICharacterRelationshipInput {
    related_character_id: number
    relation_type: string
    note?: string
    related_character: ICharacter
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
    biography?: string
    image_url?: string | null

    extra_attributes?: any[]

    belonging_level: CharacterBelongingLevel
    belonging_id: number
    belonging_object: IProject | IUniverse | ISaga | IBook

    appearances?: number[]
    relationships?: ICharacterRelationshipInput[]

}

