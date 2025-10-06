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
import Icon from '@/components/iconComponent'
import MultiSelect from '@/components/Multiselect'
import Fallback from '@/components/Fallback'

const CreateProject = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [global_loading, setGlobalLoading] = useState(true)
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

            if (response?.success) {
                const users_with_disabled = response.data.map((u) => ({
                    ...u,
                    disabled: u.id === user.id,
                }))

                setAllUsers(users_with_disabled)

                if (!form.members.find((member) => member.id == user.id)) {
                    setForm({
                        ...form,
                        members: [...form.members, { id: String(user.id) }],
                    })
                }
            }
            setGlobalLoading(false)
            setLoading(false)
        }

        getAllUsers()
    }, [])


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

    return global_loading ? (
        <Fallback type='modal' />
    ) : (
        <section className={styles.container}>
            <div className={styles.containerTop}>
                <header className={styles.header}>
                    <div className={styles.title}>
                        <h3>Nuevo proyecto</h3>
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
                        <div className={styles.multiFormGroup}>
                            <label>Miembros</label>
                            <div className={styles.members}>
                                <MultiSelect
                                    items={all_users}
                                    selected_items={all_users.filter((u) =>
                                        form.members.some((m) => m.id == u.id)
                                    )}
                                    onChange={(new_selection) =>
                                        setForm({
                                        ...form,
                                        members: new_selection.map((user) => ({ id: String(user.id) })),
                                        })
                                    }
                                    display_property='name'
                                    value_property='id'
                                    disabled_property='disabled'
                                    placeholder='Selecciona usuarios...'
                                    searchable={true}
                                    show_select_all={true}
                                />
                            </div>
                        </div>
                    </form>
                </div>
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
