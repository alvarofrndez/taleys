interface ISecurity {
    id: number
    user_id: number
    is_2fa_enabled?: boolean
    // 2fa_secret?: string || null
    // password?: string
    // confirm_password?: string
    // provider: string
    // provider_id: string | null
    // type?: string
    // role_id?: number
}

export { ISecurity }