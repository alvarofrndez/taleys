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
import Icon from '@/components/iconComponent'

const CreateSagaBook = ({ project, saga }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const BASE_URL = `/projects/${project.id}`

    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        project_id: project.id,
        title: '',
        synopsis: '',
        saga_id: saga.id,
        universe_id: saga.universe_id || null
    })

    const handleSubmit = async () => {
        if (form.title.trim() === '' || form.synopsis.trim() === '') {
            pushToast('Rellene todos los campos obligatorios', 'error')
            return
        }

        setLoading(true)
        const response = await apiCall('POST', `${BASE_URL}/books`, form)

        if (response.success) {
            pushToast(response.message, 'success')
            dispatch(closeModal())

            const universe_slug = saga.universe_id ? response.data.universe.slug : null
            const saga_slug = response.data.saga.slug

            if (universe_slug) {
                router.push(`/${project.created_by.username}/projects/${project.slug}/universes/${universe_slug}/sagas/${saga_slug}/books/${response.data.slug}`)
            } else {
                router.push(`/${project.created_by.username}/projects/${project.slug}/sagas/${saga_slug}/books/${response.data.slug}`)
            }
        }

        setLoading(false)
    }

    return (
        <section className={styles.container}>
            <div className={styles.containerTop}>
                <header className={styles.header}>
                    <div className={styles.title}>
                        <Icon
                            name='book'
                            alt='Libro'
                            width={15}
                            height={15}
                        />
                        <h3>Nuevo libro</h3>
                    </div>
                    <p>Crea un nuevo libro dentro de la saga &quot;{saga.name}&quot;.</p>
                </header>

                <div className={styles.content}>
                    <form>
                        <div className={styles.formGroup}>
                            <label htmlFor='title'>Título</label>
                            <input
                                type='text'
                                id='title'
                                name='title'
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder='Ej. El Retorno del Rey'
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor='synopsis'>Sinopsis</label>
                            <textarea
                                id='synopsis'
                                name='synopsis'
                                value={form.synopsis}
                                onChange={(e) => setForm({ ...form, synopsis: e.target.value })}
                                placeholder='Breve resumen del libro'
                                rows={4}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Saga</label>
                            <input
                                type='text'
                                value={saga.name}
                                disabled
                                className={styles.disabledInput}
                            />
                        </div>

                        {saga.universe_id && (
                            <div className={styles.formGroup}>
                                <label>Universo</label>
                                <input
                                    type='text'
                                    value={saga.universe?.name || ''}
                                    disabled
                                    className={styles.disabledInput}
                                />
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <footer className={styles.footer}>
                <button className={styles.close} type='button' onClick={() => dispatch(closeModal())}>
                    Cancelar
                </button>
                <button className={styles.buttonSubmit} type='button' onClick={handleSubmit}>
                    {loading ? <Loader color='foreground' size={15}/> : <span>Crear libro</span>}
                </button>
            </footer>
        </section>
    )
}

export default CreateSagaBook