'use client'

import styles from '@/assets/auth/projects/view.module.scss'
import { useState, useEffect } from 'react'
import { apiCall } from '@/services/apiCall'
import { useSelector } from 'react-redux'
import { useProject } from '@/context/ProjectContext'
import pushToast from '@/utils/pushToast'
import LoaderComponent from '@/components/Loader'
import ProjectDeleteButton from '@/components/auth/projects/ProjectDeleteButton'

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
        setLoadingLike(true)

        const response = await apiCall('POST', `/projects/${project.id}/like`)

        if(!response.success){
            setLoadingLike(false)
        }

        await fetchProject()
        setLoadingLike(false)
    }

    const handleSave = async () => {
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
                    Modo lectura
                </button>
            </div>
            {project.members.some((member) => member.user_id == user.id) ? 
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
                                    {like_by_user ? 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17.5" height="17.5" viewBox="0 0 24 24" fill="red" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart h-4 w-4 mr-1 fill-current"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                                    : 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17.5" height="17.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart h-4 w-4 mr-1 fill-current"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                                    }
                                </>
                            )}
                        </div>
                        <div className={styles.actionButtonsSave} onClick={handleSave}>
                            {loading_save ? (
                                <LoaderComponent size={20}/>
                            ) : (
                                <>
                                    {save_by_user ?
                                        <svg width="17.5" height="17.5" xmlns="http://www.w3.org/2000/svg" fill="black" stroke="black" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark h-5 w-5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>
                                    : 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17.5" height="17.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark h-5 w-5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>
                                    }
                                </>
                            )}
                        </div>
                    </div>
                )
            }
        </header>
    )
}