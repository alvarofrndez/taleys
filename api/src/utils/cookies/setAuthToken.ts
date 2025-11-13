import { Response } from 'express'
import { env } from '@/config/config_env'

const getCookieDomain = () => {
    const is_local = env.NODE_ENV === 'local'
    if (is_local) return undefined

    try {
        const url = new URL(env.FRONTEND_URL)
        const hostname = url.hostname

        return `.${hostname}`
    } catch (err) {
        return undefined
    }
}

const setAuthToken = (res: Response, token: string, refresh_token: string = null) => {
    const is_local = env.NODE_ENV === 'local'
    const cookie_domain = getCookieDomain()

    const base_options = {
        httpOnly: true,
        secure: !is_local,
        sameSite: !is_local ? 'none' as const : 'lax' as const,
        domain: cookie_domain,
        path: '/',
    }

    res.cookie('token', token, {
        ...base_options,
        maxAge: env.JWT_EXPIRES_IN,
    })

    if (refresh_token) {
        res.cookie('refresh_token', refresh_token, {
            ...base_options,
            maxAge: env.JWT_EXPIRES_IN_REFRESH,
        })
    }
}

export { setAuthToken }
