'use client'

import { useDispatch, useSelector } from 'react-redux'
import { logout, setAuth } from '@/stores/authSlice'
import { apiCall } from '@/services/apiCall'
import pushToast from '@/utils/pushToast'
import styles from '@/assets/auth/settings/general.module.scss'
import { openModal } from '@/stores/modalSlice'
import Loader from '@/components/Loader'
import { useState } from 'react'

const SettingsGeneralComponent = () => {
    const dispatch = useDispatch()

    const [loading_update, setLoadingUpdate] = useState(false)
    const user = useSelector((state) => state.auth.user)
    const [form_data, setFormData] = useState({
        name: user.name,
        username: user.username,
        description: user.description,
        avatar_url: user.avatar_url
    })

    const handleLogout = async () => {
        const response = await apiCall('GET', '/auth/logout')
    
        if(response){
          if(response.success){
            dispatch(logout())
          }
    
          pushToast(response.message, response.success ? 'success' : 'error')
        }
    }

    const handleDeleteAccount = async () => {
        dispatch(openModal({
            component: 'Dialog',
            props: {
                message: '¿Estas seguro de que quieres eliminar tu cuenta?, esta acción es irreversible.'
            },
            onConfirmCallback: async () => {
                const response = await apiCall('GET', '/auth/deleteAccount')

                pushToast(response.message, response.success ? 'success' : 'error')

                if(response.success)
                    dispatch(logout())
            }
        }))
    }

    const handleUpdate = async (e) => {
        e.preventDefault()

        setLoadingUpdate(true)

        const response = await apiCall('PUT', `/users/${user.id}`, form_data)

        setLoadingUpdate(false)
        pushToast(response.message, response.success ? 'success' : 'error')

        if(response.success){
            dispatch(setAuth(response.data))
        }
    }
    
    return (
      <div className={styles.container}>
        <div className={styles.section}>
            <header className={styles.header}>
                <h2>Perfíl</h2>
            </header>
            <div className={styles.content}>
                <span>Gestiona tu información personal y mantén tus datos actualizados.</span>
                <form onSubmit={handleUpdate} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Nombre</label>
                        <input type='text' placeholder='Tu nombre' value={form_data.name} onChange={(e) => setFormData({ ...form_data, name: e.target.value })} />
                        <span>Tu nombre real, el cual será visible para todos los usuarios.</span>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Nombre de usuario</label>
                        <input type='text' placeholder='Tu nombre de usuario' value={form_data.username} onChange={(e) => setFormData({ ...form_data, username: e.target.value })} />
                        <span>Tu nombre de usuario, con el que se te identificará en la plataforma, el cual será visible para todos los usuarios.</span>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Descripción</label>
                        <textarea placeholder='Tu descripción' value={form_data.description} onChange={(e) => setFormData({ ...form_data, description: e.target.value })} />
                        <span>Una breve descripción sobre ti que sirva de introducción para cualquiera que vea tu perfil. Esta será visible para todos los usuarios.</span>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Imagen de perfil</label>
                        <input disabled type='file' onChange={(e) => setFormData({ ...form_data, avatar_url: e.target.files[0] })} />
                        <span>Una foto de perfil que te identificará en la plataforma, la cual será visible para todos los usuarios.</span>
                    </div>
                    <button className={styles.update} type='submit'>
                        {
                            loading_update ? 
                                <Loader color='foreground' />
                            :
                                <span>Guardar cambios</span>
                        }
                    </button>
                </form>
            </div>
        </div>
        <div className={styles.section}>
            <header className={styles.header}>
                <h2>Cuenta</h2>
            </header>
            <div className={styles.content}>
                <span>Protege tu cuenta actualizando tu contraseña regularmente. Utiliza una combinación segura de letras, números y símbolos.</span>
                <div className={styles.buttonsContainer}>
                    <button className={styles.logout} onClick={handleLogout}>Cerrar sesión</button>
                    <button className={styles.delete} type='button' onClick={handleDeleteAccount}>Eliminar cuenta</button>
                </div>
            </div>
        </div>
      </div>
    )
}

export default SettingsGeneralComponent