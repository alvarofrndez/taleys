import redisClient from '.'
import { v4 as uuidv4 } from 'uuid'
import { env } from '@/config/config_env'
import jwt from 'jsonwebtoken'
import { NextFunction, Response} from 'express'
import CustomError from '@/modules/customerror/CustomError'
import { setAuthToken } from '../cookies/setAuthToken'
import { userService } from '@/modules/users/user.service'

const storeSession = async (user: any) => {
  const session_id = uuidv4()

  const token = jwt.sign(
    { session_id, user: user },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  )

  const refresh_token = jwt.sign(
    { session_id, user: user },
    env.JWT_SECRET_REFRESH,
    { expiresIn: env.JWT_EXPIRES_IN_REFRESH }
  )

  await redisClient.setex(`session:${session_id}`, env.JWT_EXPIRES_IN_REFRESH, JSON.stringify({ user: user, created_at: Date.now() }))

  return { token, refresh_token, session_id } 
}

const refreshSession = async (req: any, res: Response, next: NextFunction, type: any) => {
  try {
      const refresh_token = req.cookies.refresh_token
      if (!refresh_token) throw new CustomError('No autorizado', 401, type)

      let decoded: any
      try {
          decoded = jwt.verify(refresh_token, env.JWT_SECRET_REFRESH)
      } catch (err) {
          throw new CustomError('Refresh Token inválido o expirado', 401, type)
      }

      if(!await userService.getById(decoded.user.id)) throw new CustomError('Token inválido', 401, type)

      const session = await getSession(decoded.session_id)
      if (!session) throw new CustomError('Sesión expirada', 401, type)

      const token = jwt.sign(
        { session_id: decoded.session_id, user: decoded.user },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
      )

      setAuthToken(res, token)
      next()
  } catch (error) {
      next(error)
  }
}

const getSession = async (session_id: string) => {
  const data = await redisClient.get(`session:${session_id}`)
  return data ? JSON.parse(data) : null
}

const invalidateSession = async (session_id: string) => {
  await redisClient.del(`session:${session_id}`)
}

export { storeSession, refreshSession, getSession, invalidateSession }