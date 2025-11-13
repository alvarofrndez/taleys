'use client'

import styles from '@/assets/auth/projects/view.module.scss'
import { useState, useEffect } from 'react'
import { apiCall } from '@/services/apiCall'
import { useSelector } from 'react-redux'
import { useProject } from '@/context/ProjectContext'
import pushToast from '@/utils/pushToast'
import LoaderComponent from '@/components/Loader'
import ProjectDeleteButton from '@/components/auth/projects/ProjectDeleteButton'
import Icon from '@/components/iconComponent'
import { canModify } from '@/utils/projects/canModify'

export function ProjectHeader() {
    const { project, setProject, view_mode, setViewMode } = useProject()

    const user = useSelector((state) => state.auth.user)
    const [loading_like, setLoadingLike] = useState(false)
    const [loading_save, setLoadingSave] = useState(false)
    const [like_by_user, setLikeByUser] = useState(false)
    const [save_by_user, setSaveByUser] = useState(false)

    useEffect(() => {
        setInfoOfUser({success: true}, project)
    }, [])

    const fetchProject = async () => {
        const response = await apiCall('GET', `/projects/${project.id}`)

        if(response.success){
            setProject(response.data)
            console.log(response.data)
        }

        setInfoOfUser(response, response.data)
    }

    const setInfoOfUser = (response, data) => {
        if (response.success && data.likes) {
          setLikeByUser(data.likes.some((like) => like.user_id === user?.id))
        }
        
        if (response.success && data?.saves) {
          setSaveByUser(data.saves.some((save) => save.user_id === user?.id))
        }
    }

    const handleLike = async () => {
        if(!user) {
            pushToast('Debes iniciar sesión', 'error')
            return
        }

        setLoadingLike(true)

        const response = await apiCall('POST', `/projects/${project.id}/like`)

        if(!response.success){
            setLoadingLike(false)
        }

        await fetchProject()
        setLoadingLike(false)
    }

    const handleSave = async () => {
        if(!user) {
            pushToast('Debes iniciar sesión', 'error')
            return
        }

        setLoadingSave(true)

        const response = await apiCall('POST', `/projects/${project.id}/save`)

        if(!response.success){
            setLoadingSave(false)
        }else{
            pushToast(response.message, 'success')
        }

        await fetchProject()
        setLoadingSave(false)
    }

    return (
        <header className={styles.header}>
            
            {canModify(project, user) ? 
                (
                    <div className={styles.actionButtonsMember}>
                        <ProjectDeleteButton project={project} />
                    </div>
                )
            :
                (
                    <div className={styles.actionButtons}>
                        <div className={styles.actionButtonsLike} onClick={handleLike}>
                            {loading_like ? (
                                <LoaderComponent size={20}/>
                            ) : (
                                <>
                                    <Icon
                                        name='like'
                                        width={15}
                                        height={15}
                                        alt='like'
                                        fill={like_by_user ? 'var(--color-danger)' : 'transparent'}
                                        color={like_by_user ? 'var(--color-danger)' : 'var(--color-primary)'}
                                    />
                                </>
                            )}
                        </div>
                        <div className={styles.actionButtonsSave} onClick={handleSave}>
                            {loading_save ? (
                                <LoaderComponent size={20}/>
                            ) : (
                                <>
                                    <Icon
                                        name='save'
                                        width={15}
                                        height={15}
                                        alt='save'
                                        fill={save_by_user ? 'var(--color-primary)' : 'transparent'}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                )
            }

            <div className={styles.menuButtons}>
                <button
                    className={view_mode === 'full' ? styles.active : ''}
                    onClick={() => setViewMode('full')}
                >
                    Vista completa
                </button>
                <div className={styles.separator}/>
                <button
                    className={view_mode === 'read' ? styles.active : ''}
                    onClick={() => setViewMode('read')}
                >
                    Lectura
                </button>
                <div className={styles.separator}/>
                <button
                    className={view_mode === 'tree' ? styles.active : ''}
                    onClick={() => setViewMode('tree')}
                >
                    Arbología
                </button>
            </div>
        </header>
    )
}