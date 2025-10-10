import Redis from 'ioredis'
import { env } from '@/config/config_env'

let redis

if(env.NODE_ENV === 'local'){
  redis = new Redis({
    host: '127.0.0.1',
    port: 6379,
  })
}else{
  redis = new Redis(env.REDIS_URL!, {
    tls: {}
  })
}

redis.on('connect', () => console.log('🟢 Conectado a Redis'))
redis.on('error', (err) => console.error('🔴 Error en Redis:', err))

export default redis