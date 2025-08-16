import redis_client from '.'

async function addToBlacklist(token: string, expires_in: number) {
  await redis_client.setex(`blacklistedToken:${token}`, 'true', expires_in)
}

async function isTokenBlacklisted(token: string) {
  const isBlacklisted = await redis_client.get(`blacklistedToken:${token}`)
  return isBlacklisted === 'true'
}

export { addToBlacklist, isTokenBlacklisted }