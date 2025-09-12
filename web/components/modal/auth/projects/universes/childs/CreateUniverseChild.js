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

const CreateUniverseChild = ({ project, universe }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const BASE_URL = `/projects/${project.id}`
    const [loading_general, setLoadingGeneral] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        project_id: project.id,
        name: '',
        description: '',
        parent_universe_id: universe.id,
    })

    const handleSubmit = async () => {
        if (form.name.trim() === '' || form.description.trim() === '') {
            pushToast('Rellene todos los campos obligatorios', 'error')
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
      <Loader />
    ) 
    : 
    (
        <section className={styles.container}>
            <header className={styles.header}>
                <div className={styles.title}>
                    <Icon
                        name='info'
                        alt='información'
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
                        <div className={styles.formGroup}>
                            <label htmlFor='parent_universe_id'>Universo padre</label>
                            <input
                                type='text'
                                id='universe-name'
                                name='universe-name'
                                value={universe.name}
                                disabled
                            />
                        </div>
                </form>
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

export default CreateUniverseChild