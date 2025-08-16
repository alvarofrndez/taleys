import rateLimit from 'express-rate-limit'
import { env } from '@/config/config_env'

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: JSON.stringify({
        success: false,
        message: 'Limite de peticiones alcanzado. Inténtelo más tarde.',
        error_code: env.TOOMANYREQUEST_CODE
    }),
    statusCode: 429
})

export default limiter