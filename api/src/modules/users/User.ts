import db from '@/database/connection'
import { env } from '@/config/config_env'
import { IUser, IUserRegister } from './User.interface'

const COLUMNS = ['id', 'username', 'name', 'email', 'avatar_url', 'description', `TO_CHAR(created_at, 'DD TMMonth, YYYY') AS created_at`, 'role_id']
const COLUMNS_DTO = ['id', 'username', 'name', 'avatar_url']

export const userModel = {
  getById: async (id: number) => {
    const result = await db.query(
      `SELECT ${COLUMNS.join(', ')} FROM ${env.DB_TABLE_USERS} WHERE id = $1`,
      [id]
    )
    return result.rows[0]
  },

  getByIdDTO: async (id: number) => {
    const result = await db.query(
      `SELECT ${COLUMNS_DTO.join(', ')} FROM ${env.DB_TABLE_USERS} WHERE id = $1`,
      [id]
    )
    return result.rows[0]
  },

  getByEmail: async (email: string) => {
    const result = await db.query(
      `SELECT ${COLUMNS.join(', ')} FROM ${env.DB_TABLE_USERS} WHERE email = $1`,
      [email]
    )
    return result.rows[0]
  },

  getByUsername: async (username: string) => {
    const result = await db.query(
      `SELECT ${COLUMNS.join(', ')} FROM ${env.DB_TABLE_USERS} WHERE username = $1`,
      [username]
    )
    return result.rows[0]
  },

  getPasswordById: async (id: number) => {
    const result = await db.query(
      `SELECT password FROM ${env.DB_TABLE_USERS} WHERE id = $1`,
      [id]
    )
    return result.rows[0].password
  },

  getAll: async () => {
    const result = await db.query(
      `SELECT ${COLUMNS.join(', ')} FROM ${env.DB_TABLE_USERS}`
    )
    return result.rows
  },

  createUser: async (data: Record<string, any>) => {
    const query = `
      INSERT INTO ${env.DB_TABLE_USERS} (name, username, email, password, role_id) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `

    const result = await db.query(query, [
      data.name,
      data.username,
      data.email,
      data.password,
      data.role
    ])

    return await userModel.getById(result.rows[0].id)
  },

  updateUser: async (data: Record<string, any>, user_id: number) => {
    const {id, ...user} = data
    
    const fields = Object.keys(user)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ')

    const values = Object.values(user)

    const query = `UPDATE ${env.DB_TABLE_USERS} SET ${fields} WHERE id = $${values.length + 1}`

    await db.query(query, [...values, user_id])

    return await userModel.getById(user_id)
  },
}