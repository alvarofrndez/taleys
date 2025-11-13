import { Response } from 'express'
import { env } from '@/config/config_env'

const removeAuthToken = (res: Response) => {
  const is_local = process.env.NODE_ENV === 'local'
  const base_options = {
    httpOnly: true,
    secure: !is_local,
    sameSite: !is_local ? ('none' as const) : ('lax' as const),
    path: '/',
  }

  res.clearCookie('token', base_options)
  res.clearCookie('refresh_token', base_options)
}
export { removeAuthToken }