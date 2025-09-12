import { IBook } from "@/modules/books/book.interface"
import { ISaga } from "@/modules/sagas/saga.interface"
import { ICharacter } from "@/modules/characters/character.interface"

export interface IUniverse {
    id?: number
    project_id?: number
    parent_universe_id?: number
    parent_universe?: IUniverse
    name?: string
    description?: string
    cteated_at?: Date
    updated_at?: Date
    universes?: IUniverse[]
    sagas?: ISaga[]
    books?: IBook[]
    characters: ICharacter[]
}