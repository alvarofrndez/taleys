export interface IUniverse {
    id?: number
    project_id?: number
    parent_universe_id?: number
    parent_universe?: IUniverse
    name?: string
    description?: string
    cteated_at?: Date
    updated_at?: Date
}