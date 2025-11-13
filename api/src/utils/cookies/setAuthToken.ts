import { Response } from 'express'
import { env } from '@/config/config_env'

const setAuthToken = (res: Response, token: string, refresh_token: string = null) => {
    const is_local = env.NODE_ENV === 'local'
    
    res.cookie('token', token, {
        httpOnly: true,
        secure: !is_local,
        sameSite: !is_local ? 'none' : 'lax',
        maxAge: env.JWT_EXPIRES_IN,
        path: '/'
    })

    if(refresh_token){
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: !is_local,
            sameSite: !is_local ? 'none' : 'lax',
            maxAge: env.JWT_EXPIRES_IN_REFRESH,
            path: '/'
        })
    }
}

export { setAuthToken }