import redis_client from '.'

async function storeRefreshToken(user_id: string, token: string, expires_in: number) {
    await redis_client.setex(`refreshToken:${user_id}`, token, expires_in)
}
  
async function getRefreshToken(user_id: string) {
    return await redis_client.get(`refreshToken:${user_id}`)
}
  
async function invalidateRefreshToken(user_id: string) {
    await redis_client.del(`refreshToken:${user_id}`)
}
  
export { storeRefreshToken, getRefreshToken, invalidateRefreshToken }