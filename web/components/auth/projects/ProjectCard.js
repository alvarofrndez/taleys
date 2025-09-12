'use client'

import styles from '@/assets/auth/projects/card.module.scss'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import LoaderComponent from '@/components/Loader'
import { apiCall } from '@/services/apiCall'
import pushToast from '@/utils/pushToast'
import Icon from '@/components/iconComponent'

export default function ProjectCard({ project_param }) {
    const [project, setProject] = useState(project_param)
    const user = useSelector((state) => state.auth.user)
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [loading_like, setLoadingLike] = useState(false)
    const [loading_save, setLoadingSave] = useState(false)
    const [like_by_user, setLikeByUser] = useState(false)
    const [save_by_user, setSaveByUser] = useState(false)

    useEffect(() => {
        setInfoOfUser({ success: true }, project)
    }, [])

    const setInfoOfUser = (response, data) => {
        if (response.success && data.likes) {
            setLikeByUser(data.likes.some((like) => like.user_id === user?.id))
        }
        
        if (response.success && data.saves) {
            setSaveByUser(data.saves.some((save) => save.user_id === user?.id))
        }
    }

    const fetchProject = async () => {
        setLoading(true)

        const response = await apiCall('GET', `/projects/${project.id}/lite`)

        if(response.success){
            setProject(response.data)
        }

        setInfoOfUser(response, response.data)
        setLoading(false)
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

    const goToProject = (project) => {
        router.push(`/${project.created_by.username}/projects/${project.slug}`)
    }

    return <>
        {
            loading ?
                <article className={styles.container}>
                    <div className={styles.loaderContainer}>
                        <LoaderComponent />
                    </div>
                </article>
            :
                <article className={styles.container}>
                    <div className={styles.projectCardTop} onClick={() => goToProject(project)}>
                        <img src={project.images?.length > 0 && project?.images[0]?.url ? project?.images[0]?.url : '/images/placeholder.svg'} alt='imagen del proyecto' className={styles.projectCardImage}/>
                        <div className={styles.projectCardHover}>
                            <h4>{project.name}</h4>
                            {/* <ul className={styles.projectCardHoverCategories}>
                                {
                                    project.categories.map((category) => {
                                        return (
                                            <li key={category.id}>
                                                <span>{category.type.label}</span>
                                                {project.categories.indexOf(category) != project.categories.length - 1 && ','}
                                            </li>
                                        )
                                    })
                                }
                            </ul> */}
                        </div>
                    </div>
                    <div className={styles.projectCardContent}>
                    <p>{project.description?.slice(0, 100)} {project.description.length >= 100 ? '...' : null}</p>
                        <div className={styles.projectCardContentCounts}>
                            <div className={styles.projectCardContentCountsLeft}>
                                <div className={styles.projectCardContentCountsItem} onClick={handleLike}>
                                    {loading_like ? (
                                        <LoaderComponent size={20}/>
                                    ) : (
                                        <Icon
                                            name='like'
                                            width={15}
                                            height={15}
                                            alt='like'
                                            fill={like_by_user ? 'var(--color-danger)' : 'transparent'}
                                            color={like_by_user ? 'var(--color-danger)' : 'var(--color-primary)'}
                                        />
                                    )}
                                    <span>{project.likes_count ?? project.likes.length}</span>
                                </div>
                                <div className={styles.projectCardContentCountsItem} onClick={handleSave}>
                                    {loading_save ? (
                                        <LoaderComponent size={20}/>
                                    ) : (
                                        <>
                                            <Icon
                                                name='save'
                                                width={15}
                                                height={15}
                                                alt='guardado'
                                                fill={save_by_user ? 'var(--color-primary)' : 'transparent'}
                                            />
                                        </>
                                    )}
                                    <span>{project.saves_count ?? project.saves.length}</span>
                                </div>
                                {/* <div className={styles.projectCardContentCountsItem} onClick={() => goToProject(project)}>
                                    <Image
                                        src={'/images/icons/comment.svg'}
                                        width={15}
                                        height={15}
                                        alt='comments'
                                    />
                                    <span>{project.comments_count ?? project.comments.length}</span>
                                </div> */}
                            </div>
                            <div className={styles.projectCardContentCountsRight}>
                                <span>{project.created_at}</span>
                            </div>
                        </div>
                    </div>
                </article>
        }
    </>
}