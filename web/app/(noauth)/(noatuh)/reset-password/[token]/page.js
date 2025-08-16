'use client'

import styles from '@/assets/noAuth/auth.module.scss'
import pushToast from '@/utils/pushToast'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { apiCall } from '@/services/apiCall'
import InvalidToken from '@/components/InvalidToken'
import { checkPassword } from '@/utils/regeEx/checkPassword'
import GlobalLoader from '@/components/Loader'
import Link from 'next/link'

const ResetPassword = () => {
    const router = useRouter()
    const params = useParams()

    const [password, setPassword] = useState('')
    const [confirm_password, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(true)
    const [valid_token, setValidToken] = useState(false)

    useEffect(() => {
        const validateToken = async () => {
            setLoading(true)
            const response = await apiCall('POST', '/reset-password/validate-token', { token: params.token})
        
            if(response){
                if(response.success){
                    setValidToken(true)
                }else{
                    setValidToken(false)
                }
            }
            setLoading(false)
        }

        validateToken()
    }, [params])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const password_check = checkPassword(password)

        if(password_check !== true){
            pushToast(password_check, 'error')
            return
        }

        if(password != confirm_password){
            pushToast('las contraseñas deben coincidir', 'error')
            return
        }

        const response = await apiCall('POST', '/reset-password', { password, confirm_password, token: params.token })
    
        if(response){
            if(response.success){
                router.push('/login')
            }

            pushToast(response.message, response.success ? 'success' : 'error')
        }

        setLoading(false)
    }

    if(loading){
        return <GlobalLoader />
    }

    if(!valid_token){
        return <InvalidToken />
    }

    return (
        <section className={styles.layout}>
            <div className={styles.auth}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <header className={styles.title}>
                        <h2>Restablecer contraseña</h2>
                        <p>Ingrese su nueva contraseña</p>
                    </header>
                    <div className={styles.content}>
                        <div>
                            <label htmlFor='password'>Nueva contraseña</label>
                            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} name='password' placeholder='contraseña'/>
                        </div>
                        <div>
                            <label htmlFor='confirmpassword'>Confirmar contraseña</label>
                            <input type='password' value={confirm_password} onChange={(e) => setConfirmPassword(e.target.value)} name='confirmpassword' placeholder='confirmar contraseña'/>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.button} type='submit'>
                            <span>Confirmar</span>
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

export default ResetPassword