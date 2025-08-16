import { env } from '@/config/config_env'
import db from '@/database/connection'

export const securityModel = {
    selectByUserId: async (user_id: number) => {
        const result = await db.query(
            `SELECT * FROM ${env.DB_TABLE_SECURITY} WHERE user_id = $1`,
            [user_id]
        )
        return result.rows[0]
    },

    has2faActive: async (user_id: number) => {
        const result = await db.query(
            `SELECT is_2fa_enabled FROM ${env.DB_TABLE_SECURITY} WHERE user_id = $1`,
            [user_id]
        )
        return result.rows[0] || null
    },

    create: async (user_id: number, ip: string) => {
        const query = `
          INSERT INTO ${env.DB_TABLE_SECURITY} (user_id, last_login_ip)
          VALUES($1, $2)
          RETURNING id
        `
    
        const result = await db.query(query, [
            user_id,
            ip
        ])
    
        return result.rows[0].id
    },

    enable2fa: async (user_id: number, secret: string, method: string) => {
        const query = `
          UPDATE ${env.DB_TABLE_SECURITY} 
          SET is_2fa_enabled = true, "2fa_secret" = $1, "2fa_method" = $2 
          WHERE user_id = $3
        `

        console.log(secret)
    
        const result = await db.query(query, [
            secret,
            method,
            user_id,
        ])
    
        return result.rowCount
    },

    disable2fa: async (user_id: number) => {
        const query = `
          UPDATE ${env.DB_TABLE_SECURITY} 
          SET is_2fa_enabled = false, "2fa_secret" = null, "2fa_method" = null, "2fa_backup_codes" = null 
          WHERE user_id = $1
        `
    
        const result = await db.query(query, [user_id])
    
        return result.rowCount
    },

    saveBackupCodes: async (user_id: number, codes: string) => {
        const query = `
          UPDATE ${env.DB_TABLE_SECURITY} SET "2fa_backup_codes" = $1 WHERE user_id = $2
        `
    
        const result = await db.query(query, [
            codes,
            user_id
        ])
    
        return result.rowCount
    },

    updateLastLoginIp: async (user_id: number, ip: string) => {
        const query = `
          UPDATE ${env.DB_TABLE_SECURITY} SET last_login_ip = $1 
          WHERE user_id = $2
        `
    
        const result = await db.query(query, [
            ip,
            user_id
        ])
    
        return result.rowCount
    },
}