'use client'

import styles from '@/assets/noAuth/auth.module.scss'
import pushToast from '@/utils/pushToast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { apiCall } from '@/services/apiCall'
import LoaderComponent from '@/components/Loader'
import Link from 'next/link'

const ResetPasswordLink = () => {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [email_sent, setEmailSent] = useState(false)
    const [time_to_resend, setTimeToResend] = useState(30)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const response = await apiCall('POST', '/reset-password/forgot-password', { email: email })
    
        if(response){
            if(response.success){
                setEmailSent(true)
                
                const interval = setInterval(() => {
                    setTimeToResend((time_to_resend) => time_to_resend - 1)
                }, 1000)
        
                setTimeout(() => {
                    clearInterval(interval)
                    setEmailSent(false)
                    setTimeToResend(30)
                }, 30000)
            }

            pushToast(response.message, response.success ? 'success' : 'error')
        }

        setLoading(false)
    }

    return (
        <section className={styles.layout}>
            <div className={styles.auth}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <header className={styles.title}>
                        <h2>Restablecer contraseña</h2>
                        <p>Ingrese su correo electrónico para restablecer su contraseña</p>
                    </header>
                    <div className={styles.content}>
                        <div>
                            <label htmlFor='email'>Email</label>
                            <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} name='email' placeholder='email'/>
                        </div>
                        {
                            email_sent && (
                                <div className={styles.email_sent}>
                                    <p>Hemos enviado el correo a {email}</p>
                                    <p>Volver a enviar en {time_to_resend}</p>
                                </div>
                                )
                        }
                    </div>
                    
                    <div className={styles.actions}>
                        <button className={styles.button} type='submit' disabled={email_sent}>
                            {
                                loading ? 
                                    <LoaderComponent color='foreground'/> 
                                : 
                                    <span>Enviar correo</span>
                            }
                        </button>
                        <div className={styles.back}>
                            <Link href={'/login'}>Volver a iniciar sesión</Link>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default ResetPasswordLink