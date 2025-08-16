import argon2 from 'argon2'

const hashedPassword = async (password: string) => {
    const hashed_password = await argon2.hash(password)

    return hashed_password
}

export default hashedPassword