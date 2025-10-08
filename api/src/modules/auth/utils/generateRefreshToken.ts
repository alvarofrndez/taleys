import jwt from 'jsonwebtoken'
import { env } from '@/config/config_env'
import { IUser } from '@/modules/users/User.interface'

const generateRefreshToken = (user: IUser) => {
    return jwt.sign({ id: user.id, role: user.role_id }, env.JWT_SECRET_REFRESH, {
        expiresIn: env.JWT_EXPIRES_IN_REFRESH,
    })
}

export default generateRefreshToken