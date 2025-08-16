'use client'

import styles from '@/assets/noAuth/auth.module.scss'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '@/hooks/useAuth'
import pushToast from '@/utils/pushToast'
import { useState } from 'react'
import Loader from '@/components/Loader'

const GoogleProvider = ({ terms = true }) => {
    const { handleAuth } = useAuth()
    const [loading, setLoading] = useState(false)

    const login = async (google_response) => {
        if(!terms) return pushToast('Debes aceptar los términos y condiciones para continuar', 'error')
        if (google_response.credential) {
            setLoading(true)
            const decoded_data = jwtDecode(google_response.credential)
            await handleAuth('/auth/login', {
                email: decoded_data.email,
                provider: 'google',
                provider_id: decoded_data.sub,
                credential: google_response.credential
            })
            setLoading(false)
        }
    }

    return (
            loading ? (
                <div className={styles.buttonProvider}>
                    <Loader />
                </div>
            ) : (
                <GoogleLogin
                    className={styles.buttonProvider}
                    onSuccess={credentialResponse => login(credentialResponse)}
                    onError={() => pushToast('Error al iniciar sesión con Google', 'error')}
                    useOneTap
                />
        )
    )
}

export default GoogleProvider