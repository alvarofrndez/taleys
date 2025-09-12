'use client'

import styles from '@/assets/auth/projects/books/header.module.scss'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter, usePathname } from 'next/navigation'
import { useProject } from '@/context/ProjectContext'
import { apiCall } from '@/services/apiCall'
import Loader from '@/components/Loader'
import { time } from '@/services/time'
import pushToast from '@/utils/pushToast'
import { openModal } from '@/stores/modalSlice'
import Icon from '@/components/iconComponent'

export default function BookHeader({ book, onBookUpdate }) {
    const user = useSelector((state) => state.auth.user)
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useDispatch()
    const { project } = useProject()

    const [is_editing, setIsEditing] = useState(false)
    const [loading_update, setLoadingUpdate] = useState(false)
    const [loading_delete, setLoadingDelete] = useState(false)
    const [local_book, setLocalBook] = useState(book)

    const handleChange = (field, value) => {
        setLocalBook(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = async () => {
        setLoadingUpdate(true)
        
        const response = await apiCall('PUT', `/projects/${project.id}/books/${local_book.id}`, local_book)

        if (response.success) {
            pushToast(response.message, 'success')
            onBookUpdate(local_book)
            
            if(book.title != local_book.title){
                const pathname_parts = pathname.split('/').filter(Boolean)

                const new_parts = pathname_parts.map(part => 
                    decodeURIComponent(part) === book.title ? encodeURIComponent(local_book.title) : part
                )

                const new_path = '/' + new_parts.join('/')
                
                router.replace(new_path)
                router.refresh()
            }
        }

        setIsEditing(false)
        setLoadingUpdate(false)
    }

    const openModalDelete = () => {
        dispatch(openModal({
            component: 'Dialog',
            props: {
                message: '¿Estás seguro de que quieres eliminar este libro? Esta acción es irreversible.'
            },
            onConfirmCallback: async () => {
                await handleDelete()
            }
        }))
    }

    const handleDelete = async () => {
        setLoadingDelete(true)

        const response = await apiCall('DELETE', `/projects/${project.id}/books/${local_book.id}`)

        if (response.success) {
            pushToast(response.message, 'success')
        }

        setLoadingDelete(false)

        let basePath = `/${user.username}/projects/${project.slug}`
        if (local_book.universe?.slug) basePath += `/universes/${local_book.universe.slug}`
        if (local_book.saga?.slug) basePath += `/sagas/${local_book.saga.slug}`

        router.push(basePath)
    }

    return (
        <header className={styles.header}>
            <div className={styles.top}>
                {is_editing ? (
                    <input
                        type='text'
                        value={local_book.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className={styles.input}
                    />
                ) : (
                    <h2>{local_book.title}</h2>
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
                                            alt='Editar libro'
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
                                {loading_delete ? <Loader size={15} color='foreground'/> : <span>Eliminar</span>}
                            </button>
                        </div>
                    )
                }
            </div>
            {is_editing ? (
                <textarea
                    value={local_book.synopsis}
                    onChange={(e) => handleChange('synopsis', e.target.value)}
                    className={styles.textarea}
                />
            ) : (
                <span>{local_book.synopsis}</span>
            )}
            <div className={styles.info}>
                <span className={styles.created_at}>Creado el {local_book.created_at}</span>
                <div className={styles.separator}/>
                <span className={styles.updated_at}>
                    Actualizado hace {time.since(local_book.updated_at_formatted, Date.now())}
                </span>
                {local_book.universe_id && (
                    <>
                        <div className={styles.separator}/>
                        <div className={styles.parent_universe}>Universo: {local_book.universe.name}</div>
                    </>
                )}
                {local_book.saga_id && (
                    <>
                        <div className={styles.separator}/>
                        <div className={styles.created_at}>Saga: {local_book.saga.name}</div>
                    </>
                )}
            </div>
        </header>
    )
}
