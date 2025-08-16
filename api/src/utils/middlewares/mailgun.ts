import formData from 'form-data'
import Mailgun from 'mailgun.js'
import { env } from '@/config/config_env'

const mailgun = new Mailgun(formData)
const mg = mailgun.client({username: 'api', key: env.MAILGUN_API_KEY})

const sendEmail = async (to: string[], subject: string, html:string, text: string = '') => {
    try {
        await mg.messages.create(env.MAILGUN_DOMINE, {
            from: env.MAILGUN_FROM,
            to: to,
            subject: subject,
            text: text,
            html: html
        })
    
        return {
            success: true,
            status: 201,
            message: 'Correo enviado correctamente'
        }
    } catch (error: any) {
        if (error.status === 401) {
            return {
                success: false,
                status: error.status,
                message: 'Ha ocurrido un error con el proveedor de envios de correos'
            }
        } else if (error.status === 400) {
            return {
                success: false,
                status: error.status,
                message: 'Los datos no son validos'
            }
        } else {
            return {
                success: false,
                status: error.status,
                message: 'Error interno al enviar el correo'
            }
        }
    }
}

export {sendEmail}