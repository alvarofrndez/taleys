import redis_client from '.'

async function incrementFailedAttempts(ip_addres: string) {
  const attempts = await redis_client.incr(`loginAttempts:${ip_addres}`)
  if (attempts === 1) {
    await redis_client.expire(`loginAttempts:${ip_addres}`, 60 * 5)
  }
  return attempts
}

async function clearFailedAttempts(ip_addres: string) {
  await redis_client.del(`loginAttempts:${ip_addres}`)
}

async function checkFailedAttempts(ip_addres: string, max_attemps: number) {
  const attempts = await redis_client.get(`loginAttempts:${ip_addres}`)
  return parseInt(attempts || '0', 10) >= max_attemps
}

export { incrementFailedAttempts, clearFailedAttempts, checkFailedAttempts }