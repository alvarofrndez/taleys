import { Response } from 'express'
import { env } from '@/config/config_env'

const setAuthToken = (res: Response, token: string, refresh_token: string = null) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: env.JWT_EXPIRES_IN,
        path: '/'
    })

    if(refresh_token){
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: env.JWT_EXPIRES_IN_REFRESH,
            path: '/'
        })
    }
}

export { setAuthToken }