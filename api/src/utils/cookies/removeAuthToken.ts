import { Response } from 'express'
import { env } from '@/config/config_env'

const removeAuthToken = (res: Response) => {
    res.clearCookie('token')
    res.clearCookie('refresh_token')
}

export { removeAuthToken }