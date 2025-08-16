'use client'

import styles from '@/assets/auth/settings/security.module.scss'
import { apiCall } from '@/services/apiCall'
import { openModal } from '@/stores/modalSlice'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import pushToast from '@/utils/pushToast'

const SettingsSecurityPage = () => {
    const dispatch = useDispatch()
    const [has_2fa_active, setHas2faActive] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            await has2faActivate()
        }

        fetchData()
    }, [])

    const has2faActivate = async () => {
        const response = await apiCall('GET', '/security')

        if(response.success) setHas2faActive(response.data)
    }

    const active2fa = () => {
        dispatch(openModal({
            component: 'TwoFactorAuthenticationComponent',
            onConfirmCallback: async () => {
                await has2faActivate()
            },
            onCloseCallback: async () => {
                await has2faActivate()
            }
        }))
    }

    const desactive2FA = () => {
        dispatch(openModal({
            component: 'Dialog',
            props: {
                message: '¿Estas seguro de que quieres desactivar el factor de doble autentificación?'
            },
            onConfirmCallback: async () => {
                const response = await apiCall('GET', '/security/disable-2fa')

                pushToast(response.message, response.success ? 'success' : 'error')

                if(response.success)
                    await has2faActivate()
            }
        }))
    }

    const openChangePassword = () => {
        dispatch(openModal({
            component: 'ChangePassword'
        }))
    }

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <header className={styles.header}>
                    <h2>Contraseña</h2>
                    <button type='button' onClick={openChangePassword}>Actualizar contraseña</button>
                </header>
                <div className={styles.content}>
                    <span>Protege tu cuenta actualizando tu contraseña regularmente. Utiliza una combinación segura de letras, números y símbolos.</span>
                </div>
            </div>
            <div className={styles.section}>
                <header className={styles.header}>
                    <h2>Doble factor de seguridad</h2>
                    {   
                        has_2fa_active ?
                            <button type='button' onClick={desactive2FA}>Descativar</button>
                        :
                            <button type='button' onClick={active2fa}>Activar</button>
                    }
                </header>
                <div className={styles.content}>
                    <span>Protege tu cuenta actualizando tu contraseña regularmente. Utiliza una combinación segura de letras, números y símbolos.</span>
                </div>
            </div>
        </div>
    )
}

export default SettingsSecurityPage