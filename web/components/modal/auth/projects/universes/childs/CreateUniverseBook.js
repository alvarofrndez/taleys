'use client'

import styles from '@/assets/global/modal/create-project.module.scss'
import { useDispatch } from 'react-redux'
import Image from 'next/image'
import { closeModal } from '@/stores/modalSlice'
import { useState, useEffect } from 'react'
import pushToast from '@/utils/pushToast'
import { apiCall } from '@/services/apiCall'
import Loader from '@/components/Loader'
import { useRouter } from 'next/navigation'

const CreateUniverseBook = ({ project, universe }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const BASE_URL = `/projects/${project.id}/universes/${universe.id}`

    const [loading_global, setLoadingGlobal] = useState(true)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        project_id: project.id,
        title: '',
        synopsis: '',
        universe_id: universe.id,
        saga_id: null,
    })

    const [sagas, setSagas] = useState([])
    const [sagas_filter, setSagasFilter] = useState([])

    useEffect(() => {
        const fetchSagas = async () => {
            setLoadingGlobal(true)

            const sagas_response = await apiCall('GET', `${BASE_URL}/sagas`)
            if (sagas_response?.success) {
                const filtered = sagas_response.data.filter(saga => saga.universe_id === universe.id)
                setSagas(filtered)
                setSagasFilter(filtered)
            }

            setLoadingGlobal(false)
        }

        fetchSagas()
    }, [universe.id])

    const handleSagaChange = (saga_id) => {
        const selected_saga = sagas_filter.find(saga => Number(saga.id) === Number(saga_id))
        if (selected_saga) {
            setForm({
                ...form,
                saga_id: selected_saga.id,
            })
        } else {
            setForm({
                ...form,
                saga_id: null
            })
        }
    }

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

            if (form.saga_id) {
                router.push(`/${project.created_by.username}/projects/${project.name}/universes/${universe.name}/sagas/${response.data.saga.name}/books/${response.data.title}`)
            } else {
                router.push(`/${project.created_by.username}/projects/${project.name}/universes/${universe.name}/books/${response.data.title}`)
            }
        }

        setLoading(false)
    }

    return loading_global ? (
        <Loader />
    ) : (
        <section className={styles.container}>
            <header className={styles.header}>
                <div className={styles.title}>
                    <h3>Nuevo libro</h3>
                    <Image src={'/images/icons/info.svg'} alt='information' width={15} height={15} />
                </div>
                <p>Crea un nuevo libro dentro del universo &quot;{universe.name}&quot;.</p>
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
                        <label>Universo</label>
                        <input
                            type='text'
                            value={universe.name}
                            disabled
                        />
                    </div>

                    {sagas_filter.length > 0 && (
                        <div className={styles.formGroup}>
                            <label htmlFor='saga_id'>Saga (opcional)</label>
                            <select
                                id='saga_id'
                                name='saga_id'
                                value={form.saga_id || ''}
                                onChange={(e) => handleSagaChange(e.target.value)}
                            >
                                <option value=''>Ninguna</option>
                                {sagas_filter.map((saga) => (
                                    <option key={saga.id} value={saga.id}>
                                        {saga.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </form>
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

export default CreateUniverseBook
