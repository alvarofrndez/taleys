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
import Fallback from '@/components/Fallback'
import Select from '@/components/Select'

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

    // Funciones helper para encontrar objetos completos
    const getSelectedUniverse = () => {
        return form.universe_id ? universes.find(u => u.id === form.universe_id) : null
    }

    const getSelectedSaga = () => {
        return form.saga_id ? sagas_filter.find(s => s.id === form.saga_id) : null
    }

    const handleSagaChange = (selected_saga) => {
        if (selected_saga) {
            setForm({
                ...form,
                saga_id: selected_saga.id,
                universe_id: selected_saga.universe_id || null
            })

            if(selected_saga.universe_id){
                setUniversesFilter([universes.find(universe => universe.id === selected_saga.universe_id)].filter(Boolean))
                setUniverseDisabled(true)
            }else{
                setUniversesFilter([])
                setUniverseDisabled(false)
            }
        } else {
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

    const handleUniverseChange = (selected_universe) => {
        const universe_id = selected_universe ? selected_universe.id : null
        
        setForm({
            ...form,
            universe_id: universe_id,
            saga_id: null
        })

        if(universe_id){
            setSagasFilter(sagas.filter((saga) => saga.universe_id === universe_id))
        }else{
            setUniversesFilter(universes)
            setSagasFilter(sagas)
        }
    }

    const handleSubmit = async () => {
        if (form.title.trim() === '' || form.synopsis.trim() === '') {
            pushToast('Rellene todos los campos', 'error')
            return
        }

        setLoading(true)
        const response = await apiCall('POST', `${BASE_URL}/books`, form)

        if (response.success) {
            pushToast(response.message, 'success')
            dispatch(closeModal())

            if (form.universe_id && form.saga_id) {
                router.push(`/${project.created_by.username}/projects/${project.slug}/universes/${response.data.universe.slug}/sagas/${response.data.saga.slug}/books/${response.data.slug}`)
            } else if (form.saga_id) {
                router.push(`/${project.created_by.username}/projects/${project.slug}/sagas/${response.data.saga.slug}/books/${response.data.slug}`)
            } else if (form.universe_id) {
                router.push(`/${project.created_by.username}/projects/${project.slug}/universes/${response.data.universe.slug}/books/${response.data.slug}`)
            } else {
                router.push(`/${project.created_by.username}/projects/${project.slug}/books/${response.data.slug}`)
            }
        }

        setLoading(false)
    }

    return loading_global ? (
        <Fallback type='modal' />
    ) : (
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
                    <p>Crea un nuevo libro y asígnalo al proyecto, a una saga o a un universo.</p>
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
                                <label htmlFor='universe_id'>
                                    Universo {!universe_disabled ? '(opcional)' : ''}
                                </label>
                                <Select
                                    items={universes_filter}
                                    selected_item={getSelectedUniverse()}
                                    onChange={handleUniverseChange}
                                    display_property='name'
                                    value_property='id'
                                    disabled_property='disabled'
                                    placeholder={universe_disabled ? 'Universo asignado por la saga' : 'Selecciona un universo...'}
                                    searchable={!universe_disabled}
                                    disabled={universe_disabled}
                                    allow_clear={!universe_disabled}
                                />
                            </div>
                        )}

                        {sagas_filter.length > 0 && (
                            <div className={styles.formGroup}>
                                <label htmlFor='saga_id'>Saga (opcional)</label>
                                <Select
                                    items={sagas_filter}
                                    selected_item={getSelectedSaga()}
                                    onChange={handleSagaChange}
                                    display_property='name'
                                    value_property='id'
                                    disabled_property='disabled'
                                    placeholder='Selecciona una saga...'
                                    searchable={true}
                                    allow_clear={true}
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

export default CreateBook