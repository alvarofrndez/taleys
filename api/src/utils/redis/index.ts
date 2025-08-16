import Redis from 'ioredis'

const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
})

redis.on('connect', () => console.log('🟢 Conectado a Redis'))
redis.on('error', (err) => console.error('🔴 Error en Redis:', err))

export default redis