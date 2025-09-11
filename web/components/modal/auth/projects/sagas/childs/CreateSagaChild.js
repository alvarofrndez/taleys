'use client'

import styles from '@/assets/global/modal/create-project.module.scss'
import { useDispatch } from 'react-redux'
import Image from 'next/image'
import { closeModal } from '@/stores/modalSlice'
import { useState } from 'react'
import pushToast from '@/utils/pushToast'
import { apiCall } from '@/services/apiCall'
import Loader from '@/components/Loader'
import { useRouter } from 'next/navigation'

const CreateSagaChild = ({ project, saga }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const BASE_URL = `/projects/${project.id}`

    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        project_id: project.id,
        name: '',
        description: '',
        universe_id: saga.universe_id || null, // si pertenece a un universo, lo heredamos
        parent_saga_id: saga.id,
    })

    const handleSubmit = async () => {
        if (form.name.trim() === '' || form.description.trim() === '') {
            pushToast('Rellene todos los campos obligatorios', 'error')
            return
        }

        setLoading(true)

        const response = await apiCall('POST', `${BASE_URL}/sagas`, form)

        if (response.success) {
            pushToast(response.message, 'success')
            dispatch(closeModal())

            if (form.universe_id) {
                router.push(`/${project.created_by.username}/projects/${project.slug}/universes/${saga.universe.slug}/sagas/${response.data.slug}`)
            } else {
                router.push(`/${project.created_by.username}/projects/${project.slug}/sagas/${response.data.slug}`)
            }
        }

        setLoading(false)
    }

    return (
        <section className={styles.container}>
            <header className={styles.header}>
                <div className={styles.title}>
                    <h3>Nueva saga hija</h3>
                    <Image src={'/images/icons/info.svg'} alt='information' width={15} height={15} />
                </div>
                <p>Crea una nueva saga dentro de <strong>{saga.name}</strong>.</p>
            </header>

            <div className={styles.content}>
                <form>
                    <div className={styles.formGroup}>
                        <label htmlFor='name'>Nombre</label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder='Ej. La Batalla de los Cinco Ejércitos'
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor='description'>Descripción</label>
                        <textarea
                            id='description'
                            name='description'
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder='Breve descripción de la saga hija'
                            rows={4}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor='parent_saga_id'>Saga padre</label>
                        <input
                            type='text'
                            id='parent_saga_id'
                            name='parent_saga_id'
                            value={saga.name}
                            disabled
                        />
                    </div>

                    {form.universe_id && (
                        <div className={styles.formGroup}>
                            <label htmlFor='universe_id'>Universo</label>
                            <input
                                type='text'
                                id='universe_id'
                                name='universe_id'
                                value={saga.universe.name}
                                disabled
                            />
                        </div>
                    )}
                </form>
            </div>

            <footer className={styles.footer}>
                <button className={styles.close} type='button' onClick={() => dispatch(closeModal())}>
                    Cancelar
                </button>
                <button className={styles.buttonSubmit} type='button' onClick={handleSubmit}>
                    {loading ? <Loader color='foreground' size={15}/> : <span>Crear saga</span>}
                </button>
            </footer>
        </section>
    )
}

export default CreateSagaChild