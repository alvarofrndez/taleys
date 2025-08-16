import jwt from 'jsonwebtoken'
import { env } from '../../../config/env'
import IUser from '../../users/User.interface'

const generateToken = (user: IUser) => {
    return jwt.sign({ id: user.id, role: user.role_id }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    })
}

export default generateToken