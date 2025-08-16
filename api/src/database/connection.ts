import pg from 'pg'
import { env } from '@/config/config_env'

const db = new pg.Pool({
    connectionString: env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 30000
})

export default db