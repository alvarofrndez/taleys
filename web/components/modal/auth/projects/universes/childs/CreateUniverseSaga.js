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
import Icon from '@/components/iconComponent'

const CreateUniverseSaga = ({ project, universe }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const BASE_URL = `/projects/${project.id}/universes/${universe.id}`

    const [loadingGeneral, setLoadingGeneral] = useState(true)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        project_id: project.id,
        name: '',
        description: '',
        universe_id: universe.id,
        parent_saga_id: null,
    })

    const [available_sagas, setAvailableSagas] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            setLoadingGeneral(true)

            const response = await apiCall('GET', `${BASE_URL}/sagas`)

            if (response?.success) setAvailableSagas(response.data)

            setLoadingGeneral(false)
        }
        fetchData()
    }, [universe.name])

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

            router.push(`/${project.created_by.username}/projects/${project.slug}/universes/${universe.slug}/sagas/${response.data.slug}`)
        }

        setLoading(false)
    }

    return loadingGeneral ? (
        <Loader />
    ) : (
        <section className={styles.container}>
            <header className={styles.header}>
                <div className={styles.title}>
                    <Icon
                        name='info'
                        alt='información'
                        width={15}
                        height={15}
                    />
                    <h3>Nueva saga para {universe.name}</h3>
                </div>
                <p>Crea una nueva saga dentro del universo <strong>{universe.name}</strong>.</p>
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
                            placeholder='Ej. La Guerra del Anillo'
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor='description'>Descripción</label>
                        <textarea
                            id='description'
                            name='description'
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder='Breve descripción de la saga'
                            rows={4}
                        />
                    </div>

                    {/* Saga padre */}
                    {available_sagas.length > 0 && (
                        <div className={styles.formGroup}>
                            <label htmlFor='parent_saga_id'>Saga padre (opcional)</label>
                            <select
                                id='parent_saga_id'
                                name='parent_saga_id'
                                value={form.parent_saga_id || ''}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        parent_saga_id: e.target.value === '' ? null : e.target.value,
                                    })
                                }
                            >
                                <option value=''>Ninguna</option>
                                {available_sagas.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
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
                    {loading ? <Loader color='foreground' size={15}/> : <span>Crear saga</span>}
                </button>
            </footer>
        </section>
    )
}

export default CreateUniverseSaga
