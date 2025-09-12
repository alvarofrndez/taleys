import { IUniverse } from "@/modules/universes/universe.interface"
import { ISaga } from "@/modules/sagas/saga.interface"
import { ICharacter } from "@/modules/characters/character.interface"

export interface IBook {
    id?: number
    project_id?: number
    universe_id?: number
    universe?: IUniverse
    saga_id?: number
    saga?: IUniverse
    parent_saga_id?: number
    parent_saga?: ISaga
    title?: string
    synopsis?: string
    cteated_at?: Date
    updated_at?: Date
    characters: ICharacter[]
}