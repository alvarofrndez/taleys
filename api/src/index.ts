// Global
import { env } from '@/config/config_env'

// Default middlewares 
import 'tsconfig-paths/register'
import express, { Application } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

// Default middlewares options
import cors_options from '@/utils/middlewares/cors'
import limiter from '@/utils/middlewares/limiter'

// Custom middlewares
import errorHandler from '@/middlewares/errorHandler'

// Routes
import v1_routes from '@/v1/routes'

// App
const app: Application = express()

// Default middlewares  
app.use(express.json())
app.use(cors(cors_options))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(limiter)

// Routes
app.use(env.V1_API_PREFIX, v1_routes)

// Custom middlewares
app.use(errorHandler)

export default app