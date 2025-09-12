'use client'

import styles from '@/assets/auth/projects/sagas/view.module.scss'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useProject } from '@/context/ProjectContext'
import Loader from '@/components/Loader'
import { time } from '@/services/time'
import pushToast from '@/utils/pushToast'
import { apiCall } from '@/services/apiCall'
import SagaFastActions from '@/components/auth/projects/sagas/SagasFatsActions'
import { openModal } from '@/stores/modalSlice'
import { useDispatch } from 'react-redux'
import Icon from '@/components/iconComponent'

export default function SagaView({ saga, universe_name = null }) {
    const user = useSelector((state) => state.auth.user)
    const router = useRouter()
    const dispatch = useDispatch()
    const { project } = useProject()

    const [is_editing, setIsEditing] = useState(false)
    const [loading_update, setLoadingUpdate] = useState(false)
    const [loading_delete, setLoadingDelete] = useState(false)
    const [local_saga, setLocalSaga] = useState(saga)

    const handleChange = (field, value) => {
        setLocalSaga(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = async () => {
        setLoadingUpdate(true)
        
        const response = await apiCall('PUT', `/projects/${project.id}/sagas/${local_saga.id}`, local_saga)

        if (response.success) {
            pushToast(response.message, 'success')
        }

        setIsEditing(false)
        setLoadingUpdate(false)
    }

    const openModalDelete = async () => {
        dispatch(openModal({
            component: 'Dialog',
            props: {
                message: '¿Estas seguro de que quieres eliminar esta saga? es una acción irreversible.'
            },
            onConfirmCallback: async () => {
                await handleDelete()
            }
        }))
    }

    const handleDelete = async () => {
        setLoadingDelete(true)

        const response = await apiCall('DELETE', `/projects/${project.id}/sagas/${local_saga.id}`)

        if (response.success) {
            pushToast(response.message, 'success')
        }

        setLoadingDelete(false)

        if(universe_name){
            router.push(`/${project.created_by.username}/projects/${project.slug}/universes/${universe_name}`)
        }else{
            router.push(`/${project.created_by.username}/projects/${project.slug}`)
        }
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.top}>
                    {is_editing ? (
                        <input
                            type='text'
                            value={local_saga.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={styles.input}
                        />
                    ) : (
                        <h2>{local_saga.name}</h2>
                    )}
                    {
                        project.members.some((member) => member.user_id === user.id) && (
                            <div className={styles.buttonsContainer}>
                                {
                                    !is_editing ? (
                                        <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                                            <Icon
                                                name='edit'
                                                width={15}
                                                height={15}
                                                alt='Editar saga'
                                            />
                                        </button>
                                    ) : (
                                        <>
                                            <button className={styles.saveButton} onClick={handleSave}>
                                                {loading_update ? <Loader size={20}/> : <span>Guardar</span>}
                                            </button>
                                            <button className={styles.editButton} onClick={() => setIsEditing(false)}>
                                                {loading_update ? <Loader /> : <Icon
                                                                                    name='edit'
                                                                                    width={15}
                                                                                    height={15}
                                                                                    alt='Editar saga'
                                                                                />}
                                            </button>
                                        </>
                                    )
                                }
                                <button className={styles.deleteButton} onClick={openModalDelete}>
                                    {loading_delete ? <Loader size={15} color='foreground'/> : <span>Eliminar</span>}
                                </button>
                            </div>
                        )
                    }
                </div>
                {is_editing ? (
                    <textarea
                        value={local_saga.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className={styles.textarea}
                    />
                ) : (
                    <span>{local_saga.description}</span>
                )}
                <div className={styles.info}>
                    <span className={styles.created_at}>Creada el {local_saga.created_at}</span>
                    <div className={styles.separator}/>
                    <span className={styles.updated_at}>
                        Actualizada por última vez hace {time.since(local_saga.updated_at_formatted, Date.now())}
                    </span>
                    {
                        local_saga.universe_id != null &&
                        <>
                            <div className={styles.separator}/>
                            <div className={styles.parent_universe}>
                                Universo: {local_saga.universe.name}
                            </div>
                        </>
                    }
                    {
                        local_saga.parent_saga_id != null &&
                        <>
                            <div className={styles.separator}/>
                            <div className={styles.parent_universe}>
                                Saga padre: {local_saga.parent_saga.name}
                            </div>
                        </>
                    }
                </div>
            </header>
            <main className={styles.main}>
                <div className={styles.fastActions}>
                    <header>
                        <div className={styles.title}>
                            <Icon
                                name='lightning'
                                width={20}
                                height={20}
                                alt='Rayo'
                            />
                            <h2>Acciones Rápidas</h2>
                        </div>
                        <span className={styles.subtitle}>Crea nuevo contenido para tu saga</span>
                    </header>
                    <SagaFastActions project={project} saga={saga} />
                </div>
            </main>
        </div>
    )
}
