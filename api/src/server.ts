import app from "./index"
import { env } from './config/config_env'
import 'module-alias/register'

app.listen(env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${env.PORT}`)
})