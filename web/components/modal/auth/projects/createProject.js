'use client'

import styles from '@/assets/global/modal/create-project.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import { closeModal } from '@/stores/modalSlice'
import { useState, useEffect } from 'react'
import pushToast from '@/utils/pushToast'
import { apiCall } from '@/services/apiCall'
import Loader from '@/components/Loader'
import UserMultiSelect from '@/components/UserMultiselect'
import { useRouter } from 'next/navigation'

const CreateProject = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const user = useSelector((state) => state.auth.user)
    const [all_users, setAllUsers] = useState([])
    const [form, setForm] = useState({
        name: '',
        description: '',
        visibility: 'public',
        members: [],
    })

    useEffect(() => {
        const getAllUsers = async () => {
            const response = await apiCall('GET', '/users')

            if(response?.success){
                setAllUsers(response.data)
                
                // se añade al usuario logueado a los miembros
                if(!form.members.find((member) => member.id == user.id)){
                    let final_members = form.members
                    final_members.push(user)
                    setForm({...form, members: final_members})
                }
            }

            setLoading(false)
        }

        getAllUsers()
    }, [])

    const handleRemoveMember = (index) => {
        setForm(prev_data => ({
            ...prev_data,
            members: prev_data.members.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async () => {
        if (form.name.trim() === '' || form.description?.trim() === '') {
            pushToast('Rellene todos los campos', 'error')
            return
        }

        setLoading(true)

        const response = await apiCall('POST', '/projects', form)

        if (response.success) {
            pushToast(response.message, 'success')
            dispatch(closeModal())
            router.push(`/${user.username}/projects/${response.data.slug}`)
        }

        setLoading(false)
    }

    return (
        <section className={styles.container}>
            <header className={styles.header}>
                <div className={styles.title}>
                    <h3>Nuevo proyecto</h3>
                    <Image src={'/images/icons/info.svg'} alt='information' width={15} height={15}/>
                </div>
                <p>Crea un nuevo proyecto, como partida, para poder empezar a escribir tus historias.</p>
            </header>

            <div className={styles.content}>
                <form>
                    <div className={styles.formGroup}>
                        <label htmlFor='name'>Nombre del proyecto</label>
                        <input
                        type='text'
                        id='name'
                        name='name'
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder='Ej. El señor de los amillos'
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor='description'>Descripción</label>
                        <textarea
                            id='description'
                            name='description'
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder='Breve sinopsis o contexto del proyecto'
                            rows={4}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Visibilidad</label>
                        <div className={styles.toggleVisibility}>
                            <button
                                type='button'
                                className={`${styles.toggleButton} ${form.visibility === 'public' ? styles.active : ''}`}
                                onClick={() => setForm({ ...form, visibility: 'public' })}
                            >
                                Pública
                            </button>
                            <button
                                type='button'
                                className={`${styles.toggleButton} ${form.visibility === 'private' ? styles.active : ''}`}
                                onClick={() => setForm({ ...form, visibility: 'private' })}
                            >
                                Privada
                            </button>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Miembros</label>
                        <div className={styles.members}>
                            <UserMultiSelect
                                users={all_users}
                                selected_users={form.members}
                                onSelect={(selected) => setForm({
                                    ...form,
                                    members: selected
                                })}
                            />
                            <div className={styles.formGroupList}>
                                {
                                    form.members.map((m, index) => {
                                        return(
                                            <div className={styles.formGroupListItem} key={m.id}>
                                                <label>- {m.username} {m.id == user.id ? '(tú)' : null}</label>
                                                { m.id != user.id && 
                                                    <div className={styles.formGroupListItemActions}>
                                                        <Image src={'/images/icons/crossMuted.svg'} onClick={() => handleRemoveMember(index)} alt='upload' width={15} height={15} />
                                                    </div>
                                                }
                                            </div>
                                        )
                                    })  
                                }
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <footer className={styles.footer}>
                <button className={styles.close} type='button' onClick={() => dispatch(closeModal())}>
                    Cancelar
                </button>
                <button className={styles.buttonSubmit} type='button' onClick={handleSubmit}>
                    {loading ? <Loader color='foreground' size={15}/> : <span>Crear proyecto</span>}
                </button>
            </footer>
        </section>
    )
}

export default CreateProject
