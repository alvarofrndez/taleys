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

    const filtered_sagas = form.universe_id
        ? available_sagas.filter(s => s.universe_id === form.universe_id)
        : available_sagas.filter(s => s.universe_id === null)

    const getSelectedUniverse = () => {
        return form.universe_id ? universes.find(u => u.id === form.universe_id) : null
    }

    const getSelectedParentSaga = () => {
        return form.parent_saga_id ? filtered_sagas.find(s => s.id === form.parent_saga_id) : null
    }

    const handleSubmit = async () => {
        if (form.name.trim() === '' || form.description.trim() === '') {
            pushToast('Rellene todos los campos', 'error')
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
        <Fallback type='modal' />
    ) : (
        <section className={styles.container}>
            <div className={styles.containerTop}>
                <header className={styles.header}>
                    <div className={styles.title}>
                        <Icon
                            name='saga'
                            alt='saga'
                            width={15}
                            height={15}
                        />
                        <h3>Nueva saga</h3>
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
                
                        {universes.length > 0 && (
                            <div className={styles.formGroup}>
                                <label htmlFor='universe_id'>Universo (opcional)</label>
                                <Select
                                    items={universes}
                                    selected_item={getSelectedUniverse()}
                                    onChange={(selected_universe) => 
                                        setForm({
                                            ...form,
                                            universe_id: selected_universe ? selected_universe.id : null,
                                            parent_saga_id: null
                                        })
                                    }
                                    display_property='name'
                                    value_property='id'
                                    disabled_property='disabled'
                                    placeholder='Selecciona un universo...'
                                    searchable={true}
                                    allow_clear={true}
                                />
                            </div>
                        )}
                
                        {filtered_sagas.length > 0 && (
                            <div className={styles.formGroup}>
                                <label htmlFor='parent_saga_id'>Saga padre (opcional)</label>
                                <Select
                                    items={filtered_sagas}
                                    selected_item={getSelectedParentSaga()}
                                    onChange={(selected_parent_saga) => 
                                        setForm({
                                            ...form,
                                            parent_saga_id: selected_parent_saga ? selected_parent_saga.id : null
                                        })
                                    }
                                    display_property='name'
                                    value_property='id'
                                    disabled_property='disabled'
                                    placeholder='Selecciona una saga padre...'
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
                    {loading ? <Loader color='foreground' size={15}/> : <span>Crear saga</span>}
                </button>
            </footer>
        </section>
    )
}

export default CreateSaga