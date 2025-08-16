import { IUserRegister, IUser } from '@/modules/users/User.interface'
import { env } from '@/config/config_env'
import db from '@/database/connection'
import { userModel } from '@/modules/users/User'

export const authModel = {
    signInUser: async (data: IUserRegister) => {
        const query = `
          INSERT INTO ${env.DB_TABLE_USERS} (name, username, email, password, role_id, avatar_url) 
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
        `
    
        const result = await db.query(query, [
          data.name,
          data.username,
          data.email,
          data.password,
          data.role_id,
          data.avatar_url
        ])
    
        return await userModel.getById(result.rows[0].id)
    },
}