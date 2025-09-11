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

const CreateSaga = ({ project }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const BASE_URL = `/projects/${project.id}`

    const [loadingGeneral, setLoadingGeneral] = useState(true)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        project_id: project.id,
        name: '',
        description: '',
        universe_id: null,
        parent_saga_id: null,
    })

    const [universes, setUniverses] = useState([])
    const [available_sagas, setAvailableSagas] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            setLoadingGeneral(true)

            const [universesRes, sagasRes] = await Promise.all([
                apiCall('GET', `${BASE_URL}/universes`),
                apiCall('GET', `${BASE_URL}/sagas`)
            ])

            if (universesRes?.success) setUniverses(universesRes.data)
            if (sagasRes?.success) setAvailableSagas(sagasRes.data)

            setLoadingGeneral(false)
        }
        fetchData()
    }, [])

    // Filtrar sagas disponibles al cambiar universo
    const filteredSagas = form.universe_id
        ? available_sagas.filter(s => s.universe_id === form.universe_id)
        : available_sagas.filter(s => s.universe_id === null)

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

            if(response.data.universe_id){
                router.push(`/${project.created_by.username}/projects/${project.slug}/universes/${response.data.universe.slug}/sagas/${response.data.slug}`)
            }else{
                router.push(`/${project.created_by.username}/projects/${project.slug}/sagas/${response.data.slug}`)
            }
        }

        setLoading(false)
    }

    return loadingGeneral ? (
        <Loader />
    ) : (
        <section className={styles.container}>
            <header className={styles.header}>
                <div className={styles.title}>
                    <h3>Nueva saga</h3>
                    <Image src={'/images/icons/info.svg'} alt='information' width={15} height={15} />
                </div>
                <p>Crea una nueva saga y asóciala a un universo o al proyecto directamente.</p>
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

                    {/* Universo */}
                    {universes.length > 0 && (
                        <div className={styles.formGroup}>
                            <label htmlFor='universe_id'>Universo (opcional)</label>
                            <select
                                id='universe_id'
                                name='universe_id'
                                value={form.universe_id || ''}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        universe_id: e.target.value === '' ? null : e.target.value,
                                        parent_saga_id: null,
                                    })
                                }
                            >
                                <option value=''>Ninguno (Asociada solo al proyecto)</option>
                                {universes.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Saga padre */}
                    {filteredSagas.length > 0 && (
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
                                {filteredSagas.map((s) => (
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

export default CreateSaga
