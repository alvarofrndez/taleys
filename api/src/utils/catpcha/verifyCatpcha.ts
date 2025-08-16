import axios from 'axios'
import { env } from '@/config/config_env'

const verifyRecaptcha = async (token: string) => {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
        params: {
            secret: env.GOOGLE_RECAPTCHA_SECRET,
            response: token,
        },
    })

    return response.data.success
}

export {verifyRecaptcha}