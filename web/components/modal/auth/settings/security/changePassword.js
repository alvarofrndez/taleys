import styles from '@/assets/global/modal/change-password.module.scss'
import { useDispatch } from 'react-redux'
import { closeModal } from '@/stores/modalSlice'
import { useState } from 'react'
import pushToast from '@/utils/pushToast'
import { apiCall } from '@/services/apiCall'
import Loader from '@/components/Loader'

const ChangePassword = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    })

    const handleSubmit = async () => {
        setLoading(true)

        if(form.current_password === '' || form.new_password === '' || form.confirm_password === ''){
            pushToast('Todos los campos son requeridos', 'error')
            return
        }

        if(form.new_password !== form.confirm_password){
            pushToast('Las contraseñas no coinciden', 'error')
            return
        }

        const response = await apiCall('POST', '/security/changePassword', form)

        pushToast(response.message, response.success ? 'success' : 'error')

        if(response.success){
            dispatch(closeModal())
        }

        setLoading(false)
    }

    return (
        <section className={styles.container}>
            <div className={styles.containerTop}>
                <header className={styles.header}>
                    <div className={styles.title}>
                        <h3>Cambiar contraseña</h3>
                    </div>
                    <p>Cambia tu contraseña actual por una nueva.</p>
                </header>
                <div className={styles.content}>
                    <form >
                        <div className={styles.form_group}>
                            <label htmlFor='current_password'>Contraseña actual</label>
                            <input value={form.current_password} onChange={(e) => setForm({ ...form, current_password: e.target.value })} type='password' id='current_password' name='current_password' />
                        </div>
                        <div className={styles.form_group}>
                            <label htmlFor='new_password'>Nueva contraseña</label>
                            <input value={form.new_password} onChange={(e) => setForm({ ...form, new_password: e.target.value })} type='password' id='new_password' name='new_password' />
                        </div>
                        <div className={styles.form_group}>
                            <label htmlFor='confirm_password'>Confirmar contraseña</label>
                            <input value={form.confirm_password} onChange={(e) => setForm({ ...form, confirm_password: e.target.value })} type='password' id='confirm_password' name='confirm_password' />
                        </div>
                    </form>
                </div>
            </div>

            <footer className={styles.footer}>
                <button className={styles.close} type='button' onClick={() => dispatch(closeModal())}>Cancelar</button>
                <button className={styles.buttonSubmit} type='button' onClick={handleSubmit}>
                    {
                        loading ?
                            <Loader color='foreground'/>
                        :
                            <span>Cambiar contraseña</span>
                    }
                </button>
            </footer>
        </section>
    )
}

export default ChangePassword