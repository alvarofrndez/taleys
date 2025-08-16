// verification.js
import redis_client from '.'

async function storeVerificationToken(email: string, token: string, expires_in: number) {
  await redis_client.setex(`verificationToken:${email}`, token, expires_in)
}

async function verifyToken(email: string, token: string) {
  const storedToken = await redis_client.get(`verificationToken:${email}`)
  if (storedToken === token) {
    await redis_client.del(`verificationToken:${email}`)
    return true
  }
  return false
}

export { storeVerificationToken, verifyToken }