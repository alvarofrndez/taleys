'use client'

import styles from '@/assets/auth/projects/universes/view.module.scss'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useProject } from '@/context/ProjectContext'
import { apiCall } from '@/services/apiCall'
import GlobalLoader from '@/components/GlobalLoader'
import Loader from '@/components/Loader'
import { time } from '@/services/time'
import Image from 'next/image'
import UniverseFastActions from '@/components/auth/projects/universes/UniverseFastActions'
import pushToast from '@/utils/pushToast'
import { openModal } from '@/stores/modalSlice'
import { useDispatch } from 'react-redux'

export default function UniverseViewPage() {
    const router = useRouter()
    const params = useParams()
    const universe_name = params['universe_name']
    const dispatch = useDispatch()

    const user = useSelector((state) => state.auth.user)
    const { project, setProject } = useProject()
    const [ universe, setUniverse ] = useState(null)
    const [loading, setLoading] = useState(true)
    const [is_editing, setIsEditing] = useState(false)
    const [loading_update, setLoadingUpdate] = useState(false)
    const [loading_delete, setLoadingDelete] = useState(false)

    useEffect(() => {
        async function fetchUniverse() {
            setLoading(true)
            const response = await apiCall('GET', `/projects/${project.id}/universes/name/${universe_name}`)
            if (response.success) {
                setUniverse(response.data)
            } else {
                router.push('/not-found')
            }
            setLoading(false)
        }
        fetchUniverse()
    }, [universe_name])
    
    const fetchUniverse = async () => {
        setLoading(true)
        const response = await apiCall('GET', `/projects/${project.id}/universes/name/${universe.name}`)
        if (response.success) {
            setUniverse(response.data)
        }
        setLoading(false)
    }

    const handleChange = (field, value) => {
        setUniverse(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = async () => {
        setLoadingUpdate(true)
        
        const response = await apiCall('PUT', `/projects/${project.id}/universes/${universe.id}`, universe)

        if (response.success) {
            pushToast(response.message, 'success')
        }

        fetchUniverse()
        setIsEditing(false)
        setLoadingUpdate(false)
    }

    const openModalDelete = async () => {
        dispatch(openModal({
            component: 'Dialog',
            props: {
                message: '¿Estas seguro de que quieres eliminar este universo? es una acción irreversible.'
            },
            onConfirmCallback: async () => {
                await handleDelete()
            }
        }))
    }
    

    const handleDelete = async () => {
        setLoadingDelete(true)
        
        const response = await apiCall('DELETE', `/projects/${project.id}/universes/${universe.id}`)

        if (response.success) {
            pushToast(response.message, 'success')
        }

        setLoadingDelete(false)
        router.push(`/${project.created_by.username}/projects/${project.name}`)
    }

    if (loading) return <GlobalLoader />
    if(!universe) return <GlobalLoader />

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.top}>
                    {is_editing ? (
                        <input
                            type='text'
                            value={universe.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={styles.input}
                        />
                        ) : (
                        <h2>{universe.name}</h2>
                    )}
                    {
                        project.members.some((member) => member.user_id === user.id) && (
                            <div className={styles.buttonsContainer}>
                                {
                                    !is_editing ? (
                                        <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                                            <Image src='/images/icons/edit.svg' alt='Editar saga' width={15} height={15}/>
                                        </button>
                                    ) : (
                                        <>
                                            <button className={styles.saveButton} onClick={handleSave}>
                                                {loading_update ? <Loader size={20}/> : <span>Guardar</span>}
                                            </button>
                                            <button className={styles.editButton} onClick={() => setIsEditing(false)}>
                                                {loading_update ? <Loader /> : <Image src='/images/icons/edit.svg' alt='Editar saga' width={15} height={15}/>}
                                            </button>
                                        </>
                                    )
                                }
                                <button className={styles.deleteButton} onClick={openModalDelete}>
                                    {loading_delete ? <Loader size={20} color='foreground'/> : <span>Eliminar</span>}
                                </button>
                            </div>
                        )
                    }
                </div>
                    {is_editing ? (
                        <textarea
                            value={universe.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className={styles.textarea}
                        />
                        ) : (
                        <span>{universe.description}</span>
                    )}
                <div className={styles.info}>
                    <span className={styles.created_at}>Creado el {universe.created_at}</span>
                    <div className={styles.separator}/>
                    <span className={styles.updated_at}>
                        Actualizado por última vez hace {time.since(universe.updated_at_formatted, Date.now())}
                    </span>
                    <div className={styles.separator}/>
                    {
                        universe.parent_universe_id != null &&
                        <div className={styles.parent_universe}>
                            Universo padre: {universe.parent_universe.name}
                        </div>
                    }
                </div>
            </header>
            <main className={styles.main}>
                <div className={styles.fastActions}>
                    <header>
                        <div className={styles.title}>
                            <Image src={'/images/icons/lightning.svg'} width={20} height={20} alt='rayo'/>
                            <h2>Acciones Rápidas</h2>
                        </div>
                        <span className={styles.subtitle}>Crea nuevo contenido para tu proyecto</span>
                    </header>
                    <UniverseFastActions project={project} universe={universe}/>
                </div>
            </main>
        </div>
    )
}