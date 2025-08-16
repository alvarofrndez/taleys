'use client'

import styles from '@/assets/noAuth/auth.module.scss'
import { useState } from 'react'
import Image from 'next/image'
import { apiCall } from '@/services/apiCall'
import { checkEmail } from '@/utils/regeEx/checkEmail'
import { checkUsername } from '@/utils/regeEx/checkUsername'
import { checkName } from '@/utils/regeEx/checkName'
import { checkPassword } from '@/utils/regeEx/checkPassword'
import { useDispatch } from 'react-redux'
import { setAuth } from '@/stores/authSlice'
import pushToast from '@/utils/pushToast'
import GoogleProvider from '@/components/google/GoogleProvider'
import GitHubProvider from '@/components/github/GithubProvider'
import LoaderComponent from '@/components/Loader'
import Link from 'next/link'

const Singin = () => {
    const dispatch = useDispatch()

    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm_password, setConfirmPassword] = useState('')
    const [terms, setTerms] = useState(false)
    const [show_password, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const name_check = checkName(name)
        const username_check = checkUsername(username)
        const email_check = checkEmail(email)
        const password_check = checkPassword(password)

        if(name_check !== true){
            pushToast(name_check, 'error')
            setLoading(false)
            return
        }

        if(username_check !== true){
            pushToast(username_check, 'error')
            setLoading(false)
            return
        }

        if(email_check !== true){
            pushToast(email_check, 'error')
            return
        }

        if(password_check !== true){
            pushToast(password_check, 'error')
            setLoading(false)
            return
        }

        if(password != confirm_password){
            pushToast('las contraseñas deben coincidir', 'error')
            setLoading(false)
            return
        }

        if(!terms){
            pushToast('Debe aceptar los términos y condiciones', 'error')
            setLoading(false)
            return
        }

        const response = await apiCall('POST', '/auth/sign-in', {
            name: name,
            username: username,
            email: email,
            password: password,
            confirm_password: confirm_password,
            provider: 'credentials',
            provider_id: null,
            type: 'user'
        })

        if(response){
            if(response.success){
                dispatch(setAuth(response.data))
            }

            pushToast(response.message, response.success ? 'success' : 'error')
        }

        setLoading(false)
    }

    return (
        <div className={styles.layout}>
            <section className={styles.auth}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <header className={styles.title}>
                        <h2>Registrarse</h2>
                        <p>Complete el formulario con los datos necesarios para registrarse</p>
                    </header>
                    
                    <div className={styles.content}>
                        <div>
                            <label htmlFor='name'>Nombre</label>
                            <input type='text' value={name} onChange={(e) => setName(e.target.value)} name='name' placeholder='Nombre completo'/>
                        </div>
                        <div>
                            <label htmlFor='username'>Nombre de usuario</label>
                            <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} name='username' placeholder='Nombre de usuario'/>
                        </div>
                        <div>
                            <label htmlFor='email'>Correo electrónico</label>
                            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} name='email' placeholder='Correo electrónico'/>
                        </div>
                        <div>
                            <label htmlFor='password'>Contraseña</label>
                            <input type={show_password ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} name='password' placeholder='Contraseña'/>
                            <Image className={styles.icon} onClick={() => setShowPassword(!show_password)} src={`/images/icons/${show_password ? 'hide' : 'show'}.svg`} alt='mostrar' width={15} height={15}/>
                        </div>
                        <div>
                            <label htmlFor='confirmpassword'>Confirmar contraseña</label>
                            <input type={show_password ? 'text' : 'password'} value={confirm_password} onChange={(e) => setConfirmPassword(e.target.value)} name='confirmpassword' placeholder='Confirmar contraseña'/>
                            <Image className={styles.icon} onClick={() => setShowPassword(!show_password)} src={`/images/icons/${show_password ? 'hide' : 'show'}.svg`} alt='mostrar' width={15} height={15}/>
                        </div>
                        <div className={styles.terms}>
                            <label htmlFor='terms'>Acepto los <Link href={'/terms'}>términos y condiciones</Link></label>
                            <input type='checkbox' checked={terms} onChange={(e) => setTerms(e.target.checked)} name='terms' placeholder='Acepto los términos y condiciones'/>
                        </div>
                    </div>

                    <footer className={styles.actions}>
                        <button className={styles.button} type='submit'>
                            {
                                loading ? 
                                    <LoaderComponent color='foreground'/> 
                                : 
                                    <span>Registrarse</span>
                            }
                        </button>

                        <div className={styles.divider}>
                            <span>O CONTINÚA CON</span>
                        </div>

                        <div className={styles.providers}>
                            <GoogleProvider terms={terms} />
                            <GitHubProvider terms={terms} />
                        </div>

                        <div className={styles.register}>
                            <span>¿Ya tienes una cuenta?</span>
                            <Link href={'/login'}>Iniciar sesión</Link>
                        </div>
                    </footer>
                </form>
            </section>
        </div>
    )
}

export default Singin