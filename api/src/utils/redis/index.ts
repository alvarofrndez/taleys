import Redis from 'ioredis'
import { env } from '@/config/config_env'

const redis = new Redis(env.REDIS_URL)

redis.on('connect', () => console.log('🟢 Conectado a Redis'))
redis.on('error', (err) => console.error('🔴 Error en Redis:', err))

export default redis