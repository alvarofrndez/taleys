'use client'

import styles from '@/assets/auth/projects/universes/header.module.scss'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useProject } from '@/context/ProjectContext'
import { apiCall } from '@/services/apiCall'
import Loader from '@/components/Loader'
import { time } from '@/services/time'
import Image from 'next/image'
import pushToast from '@/utils/pushToast'
import { openModal } from '@/stores/modalSlice'
import Icon from '@/components/iconComponent'

export default function UniverseHeader({ universe, onUniverseUpdate }) {
    const user = useSelector((state) => state.auth.user)
    const router = useRouter()
    const dispatch = useDispatch()
    const { project } = useProject()

    const [is_editing, setIsEditing] = useState(false)
    const [loading_update, setLoadingUpdate] = useState(false)
    const [loading_delete, setLoadingDelete] = useState(false)
    const [local_universe, setLocalUniverse] = useState(universe)

    const handleChange = (field, value) => {
        setLocalUniverse(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = async () => {
        setLoadingUpdate(true)
        
        const response = await apiCall('PUT', `/projects/${project.id}/universes/${local_universe.id}`, local_universe)

        if (response.success) {
            pushToast(response.message, 'success')
            onUniverseUpdate(local_universe)
        }

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
        
        const response = await apiCall('DELETE', `/projects/${project.id}/universes/${local_universe.id}`)

        if (response.success) {
            pushToast(response.message, 'success')
        }

        setLoadingDelete(false)
        router.push(`/${project.created_by.username}/projects/${project.slug}`)
    }

    return (
        <header className={styles.header}>
            <div className={styles.top}>
                {is_editing ? (
                    <input
                        type='text'
                        value={local_universe.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={styles.input}
                    />
                ) : (
                    <h2>{local_universe.name}</h2>
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
                                            alt='Editar universo'
                                        />
                                    </button>
                                ) : (
                                    <>
                                        <button className={styles.saveButton} onClick={handleSave}>
                                            {loading_update ? <Loader size={20}/> : <span>Guardar</span>}
                                        </button>
                                        <button className={styles.editButton} onClick={() => setIsEditing(false)}>
                                            <Icon
                                                name='edit'
                                                width={15}
                                                height={15}
                                                alt='Cancelar edición'
                                            />
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
                    value={local_universe.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className={styles.textarea}
                />
            ) : (
                <span>{local_universe.description}</span>
            )}
            <div className={styles.info}>
                <span className={styles.created_at}>Creado el {local_universe.created_at}</span>
                <div className={styles.separator}/>
                <span className={styles.updated_at}>
                    Actualizado por última vez hace {time.since(local_universe.updated_at_formatted, Date.now())}
                </span>
                <div className={styles.separator}/>
                {
                    local_universe.parent_universe_id != null &&
                    <div className={styles.parent_universe}>
                        Universo padre: {local_universe.parent_universe.name}
                    </div>
                }
            </div>
        </header>
    )
}
