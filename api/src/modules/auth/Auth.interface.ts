interface IAuhtUser {
    email: string
    password?: string
    provider: string
    provider_id: string | null
    credential?: string
    avatar_url?: string
    name?: string
}

export default IAuhtUser