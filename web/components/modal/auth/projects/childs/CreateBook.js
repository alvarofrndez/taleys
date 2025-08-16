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

const CreateBook = ({ project }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const BASE_URL = `/projects/${project.id}`

    const [loading_global, setLoadingGlobal] = useState(true)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        project_id: project.id,
        title: '',
        synopsis: '',
        universe_id: null,
        saga_id: null,
    })

    const [universes, setUniverses] = useState([])
    const [universes_filter, setUniversesFilter] = useState([])
    const [universe_disabled, setUniverseDisabled] = useState(false)
    const [sagas, setSagas] = useState([])
    const [sagas_filter, setSagasFilter] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            setLoadingGlobal(true)

            const [universes_response, sagas_response] = await Promise.all([
                apiCall('GET', `${BASE_URL}/universes`),
                apiCall('GET', `${BASE_URL}/sagas`)
            ])

            if (universes_response?.success) {
                setUniverses(universes_response.data)
                setUniversesFilter(universes_response.data)
            }
            if (sagas_response?.success){
                setSagas(sagas_response.data)
                setSagasFilter(sagas_response.data)
            }

            setLoadingGlobal(false)
        }
        fetchData()
    }, [])

    const handleSagaChange = (saga_id) => {
        const selected_saga = sagas_filter.find(saga => Number(saga.id) === Number(saga_id))

        if (selected_saga) {
            setForm({
                ...form,
                saga_id: selected_saga.id,
                universe_id: selected_saga.universe_id || null
            })

            if(selected_saga.universe_id){
                setUniversesFilter(universes.map((universe) => universe.id == selected_saga.universe_id))
                setUniverseDisabled(true)
            }else{
                setUniversesFilter([])
                setUniverseDisabled(false)
            }
        }else{
            setForm({
                ...form,
                saga_id: null,
                universe_id: null
            })

            setUniversesFilter(universes)
            setSagasFilter(sagas)
            setUniverseDisabled(false)
        }
    }

    const handleUniverseChange = (universe_id) => {
        setForm({
            ...form,
            universe_id: universe_id === '' ? null : Number(universe_id),
            saga_id: null
        })

        if(universe_id){
            setSagasFilter(sagas.filter((saga) => saga.universe_id == universe_id))
        }else{
            setUniversesFilter(universes)
            setSagasFilter(sagas)
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

            if (form.universe_id && form.saga_id) {
                router.push(`/${project.created_by.username}/projects/${project.name}/universes/${response.data.universe.name}/sagas/${response.data.saga.name}/books/${response.data.title}`)
            } else if (form.saga_id) {
                router.push(`/${project.created_by.username}/projects/${project.name}/sagas/${response.data.saga.name}/books/${response.data.title}`)
            } else if (form.saga_id) {
                router.push(`/${project.created_by.username}/projects/${project.name}/universes/${response.data.universe.name}/books/${response.data.title}`)
            } else {
                router.push(`/${project.created_by.username}/projects/${project.name}/books/${response.data.title}`)
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
                <p>Crea un nuevo libro y asígnalo al proyecto, una saga o un universo.</p>
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

                    {universes_filter.length > 0 && (
                        <div className={styles.formGroup}>
                            <label htmlFor='universe_id'>Universo {!universe_disabled ? '(opcional)' : ''}</label>
                            {
                                !universe_disabled ?
                                    <select
                                        id='universe_id'
                                        name='universe_id'
                                        value={form.universe_id}
                                        onChange={(e) => handleUniverseChange(e.target.value)}
                                    >
                                        <option value=''>Ninguno</option>
                                        {universes_filter.map((universe) => (
                                            <option key={universe.id} value={universe.id}>
                                                {universe.name}
                                            </option>
                                        ))}
                                    </select>
                                :
                                    <input
                                        type='text'
                                        id='universe_id'
                                        name='universe_id'
                                        value={universes.find((universe) => universe.id === form.universe_id)?.name || ''}
                                        disabled
                                    />
                            }
                            
                        </div>
                    )}


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

export default CreateBook
