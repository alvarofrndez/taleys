import argon2 from 'argon2';

const verifyPassword = async (password: string, hashedPassword: string) => {
    if(!password || !hashedPassword) return false
    return await argon2.verify(hashedPassword, password)
}

export default verifyPassword