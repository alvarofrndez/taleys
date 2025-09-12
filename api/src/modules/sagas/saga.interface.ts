import { IUniverse } from "@/modules/universes/universe.interface"
import { IBook } from "@/modules/books/book.interface"
import { ICharacter } from "@/modules/characters/character.interface"

export interface ISaga {
    id?: number
    project_id?: number
    universe_id?: number
    universe?: IUniverse
    parent_saga_id?: number
    parent_saga?: ISaga
    name?: string
    description?: string
    cteated_at?: Date
    updated_at?: Date
    sagas: ISaga[]
    books: IBook[]
    characters: ICharacter[]
}