'use client'

import styles from '@/assets/noAuth/auth.module.scss'
import { useState } from 'react'
import { checkEmail } from '@/utils/regeEx/checkEmail'
import GoogleProvider from '@/components/google/GoogleProvider'
import GitHubProvider from '@/components/github/GithubProvider'
import ReCAPTCHA from 'react-google-recaptcha'
import pushToast from '@/utils/pushToast'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import LoaderComponent from '@/components/Loader'

const MAX_ATTEMPTS = 3

const Login = () => {
    const { 
        requires2FA, 
        totpCode, 
        backupCodes,
        isBackupMode,
        setTotpCode, 
        setBackupCodes,
        handleFileUpload,
        handleToggleMode,
        handleAuth, 
        handle2FASubmit 
    } = useAuth()
    
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    let attempts = 0
    const [captcha_token, setCaptchaToken] = useState('')
    const [captcha_visible, setCaptchaVisible] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        if(captcha_visible && !captcha_token) {
            pushToast('Por favor verifica el captcha', 'error')
            return
        }

        const check = checkEmail(email)

        if(check === true){
            const response = await handleAuth('/auth/login', {
                email: email,
                password: password,
                provider: 'credentials',
                provider_id: null,
                captcha_token: captcha_token
            })

            attempts += 1
            if(attempts >= MAX_ATTEMPTS || !response?.success){
                setCaptchaVisible(true)
            }

            if(response?.success) {
                attempts = 0
                setCaptchaVisible(false)
            }
        }else{
            pushToast(check, 'error')
        }

        setLoading(false)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            handleFileUpload(file)
        }
    }

    return (
        <div className={styles.layout}>
            <section className={styles.auth}>
                {requires2FA ? (
                    <form className={styles.form} onSubmit={handle2FASubmit} >
                        <header className={styles.title}>
                            <h2>Verificación en dos pasos</h2>
                            {isBackupMode ? (
                                <p>Ingrese sus códigos de respaldo</p>
                            ) : (
                                <p>Por favor, ingrese el código de autenticación generado por su aplicación</p>
                            )}
                        </header>
                            {isBackupMode ? (
                                <div className={styles.content}>
                                    <div className={styles.backup}>
                                        <label htmlFor='backup'>Códigos de respaldo</label>
                                        <input
                                            type='text'
                                            value={backupCodes}
                                            onChange={(e) => setBackupCodes(e.target.value)}
                                            name='backup'
                                            placeholder='Pegue aquí sus códigos de respaldo'
                                        />
                                    </div>
                                    <div className={styles.file}>
                                        <label htmlFor='backup-file'>O suba un archivo con sus códigos</label>
                                        <input
                                            type='file'
                                            id='backup-file'
                                            accept='.txt'
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <button className={styles.handleToggleMode} type='button' onClick={handleToggleMode}>Usar código de autenticación</button>

                                </div>
                            ) : (
                                <div className={styles.content}>
                                    <div className={styles.totp}>
                                        <label htmlFor='totp'>Código de autenticación</label>
                                        <input 
                                            type='text' 
                                            value={totpCode} 
                                            onChange={(e) => setTotpCode(e.target.value)} 
                                            name='totp' 
                                            placeholder='Ingrese el código de 6 dígitos'
                                        />
                                    </div>
                                    <button className={styles.handleToggleMode} type='button' onClick={handleToggleMode}>Usar códigos de respaldo</button>
                                </div>
                            )}
                            <footer className={styles.actions}>
                                <button type='submit' disabled={loading} className={styles.button}>
                                    {
                                        loading ? 
                                            <LoaderComponent color='foreground'/> 
                                        : 
                                            <span>Verificar</span>
                                    }
                                </button>
                                <div className={styles.back}>
                                    <Link href={'/login'}>Volver a iniciar sesión</Link>
                                </div>
                            </footer>
                    </form>
                ) : (
                    <form className={styles.form} onSubmit={handleSubmit} >
                        <header className={styles.title}>
                            <h2>Iniciar sesión</h2>
                            <p>Ingrese su correo electrónico y contraseña para iniciar sesión</p>
                        </header>
                        <div className={styles.content}>
                            <div>
                                <label htmlFor='email'>Correo electrónico</label>
                                <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} name='email' placeholder='email'/>
                            </div>
                            <div>
                                <label htmlFor='password'>Contraseña</label>
                                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} name='password' placeholder='contraseña'/>
                            </div>
                            <Link href={'/reset-password'} className={styles.resetPasswordLink}>He olvidado mi contraseña</Link>
                        </div>
                        <footer className={styles.actions}>
                            {
                                captcha_visible && (
                                    <ReCAPTCHA
                                        sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA}
                                        onChange={(token) => setCaptchaToken(token || '')}
                                    />
                                )
                            }
                            <button className={styles.button} type='submit'>
                                {
                                    loading ? 
                                        <LoaderComponent color='foreground'/> 
                                    : 
                                        <span>Iniciar sesión</span>
                                }
                            </button>

                            <div className={styles.divider}>
                                <span>O CONTINÚA CON</span>
                            </div>

                            <div className={styles.providers}>
                                <GoogleProvider />
                                <GitHubProvider />
                            </div>

                            <div className={styles.register}>
                                <span>¿No tienes una cuenta?</span>
                                <Link href={'/sign-in'}>Regístrate</Link>
                            </div>
                        </footer>
                    </form>
                )}
            </section>
        </div>
    )
}

export default Login