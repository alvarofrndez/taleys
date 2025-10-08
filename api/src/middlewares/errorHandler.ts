import { Request, Response, NextFunction } from 'express'
import ICustomError from '@/modules/customerror/CustomError.interface'
import { env } from '@/config/config_env' 

const errorHandler = async (err: ICustomError, req: Request, res: Response, next: NextFunction) => {
  // Controla si el error no esta lanzado por CustomError para no mostrar un mensaje que no se debe
  // if(!err.status_code){
  //   err.message = env.ERROR_MESSAGE
  // }

  const status_code = err.status_code || env.ERROR_STATUS_CODE
  const message = err.message || env.ERROR_MESSAGE
  const error_code = err.error_code || env.ERROR_CODE

  console.log('Error capturado por el handler:', req.url, status_code, message)
  console.log(err.stack)

  res.status(status_code).json({
    success: false,
    message: message,
    error_code: error_code
  })
}

export default errorHandler