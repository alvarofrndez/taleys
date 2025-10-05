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

const CreateUniverse = ({ project }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const BASE_URL = `/projects/${project.id}`
    const [loading_general, setLoadingGeneral] = useState(true)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        project_id: project.id,
        name: '',
        description: '',
        parent_universe_id: null,
    })
    const [parent_universes, setParentUniverses] = useState([])

    useEffect(() => {
        const fetchUniverses = async () => {
            setLoadingGeneral(true)
            const response = await apiCall('GET', `${BASE_URL}/universes`)

            if (response?.success) {
                setParentUniverses(response.data)
            }
            setLoadingGeneral(false)
        }
        fetchUniverses()
    }, [])

    const getSelectedParentUniverse = () => {
        return form.parent_universe_id ? parent_universes.find(u => u.id === form.parent_universe_id) : null
    }

    const handleSubmit = async () => {
        if (form.name.trim() === '' || form.description.trim() === '') {
            pushToast('Rellene todos los campos', 'error')
            return
        }

        setLoading(true)

        const response = await apiCall('POST', `${BASE_URL}/universes`, form)

        if (response.success) {
            pushToast(response.message, 'success')
            dispatch(closeModal())
            router.push(`/${project.created_by.username}/projects/${project.slug}/universes/${response.data.slug}`)
        }

        setLoading(false)
    }

    return loading_general ? (
        <Fallback type='modal' />
    ) 
    : 
    (
        <section className={styles.container}>
            <div className={styles.containerTop}>
                <header className={styles.header}>
                    <div className={styles.title}>
                        <Icon
                            name='internet'
                            alt='Universo'
                            width={15}
                            height={15}
                        />
                        <h3>Nuevo universo</h3>
                    </div>
                    <p>Crea un nuevo universo para organizar tus historias y sagas.</p>
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
                                placeholder='Ej. Tierra Media'
                            />
                        </div>
                
                        <div className={styles.formGroup}>
                            <label htmlFor='description'>Descripción</label>
                            <textarea
                                id='description'
                                name='description'
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder='Breve descripción del universo'
                                rows={4}
                            />
                        </div>
                
                        {
                            parent_universes.length > 0 &&
                            <div className={styles.formGroup}>
                                <label htmlFor='parent_universe_id'>Universo padre (opcional)</label>
                                <Select
                                    items={parent_universes}
                                    selected_item={getSelectedParentUniverse()}
                                    onChange={(selected_universe) => 
                                        setForm({
                                            ...form,
                                            parent_universe_id: selected_universe ? selected_universe.id : null
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
                        }
                    </form>
                </div>
            </div>

            <footer className={styles.footer}>
                <button className={styles.close} type='button' onClick={() => dispatch(closeModal())}>
                    Cancelar
                </button>
                <button className={styles.buttonSubmit} type='button' onClick={handleSubmit}>
                    {loading ? <Loader color='foreground' size={15}/> : <span>Crear universo</span>}
                </button>
            </footer>
        </section>
    )
}

export default CreateUniverse