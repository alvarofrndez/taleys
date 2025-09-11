'use client'

import styles from '@/assets/auth/projects/card.module.scss'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import LoaderComponent from '@/components/Loader'
import { apiCall } from '@/services/apiCall'
import pushToast from '@/utils/pushToast'

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
                                        <>
                                            {like_by_user ? 
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="red" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart h-4 w-4 mr-1 fill-current"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                                            : 
                                                <Image
                                                    src={'/images/icons/like.svg'}
                                                    width={15}
                                                    height={15}
                                                    alt='likes'
                                                />
                                            }
                                        </>
                                    )}
                                    <span>{project.likes_count ?? project.likes.length}</span>
                                </div>
                                <div className={styles.projectCardContentCountsItem} onClick={handleSave}>
                                    {loading_save ? (
                                        <LoaderComponent size={20}/>
                                    ) : (
                                        <>
                                            {save_by_user ? 
                                                <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" fill="black" stroke="black" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark h-5 w-5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>
                                            : 
                                                <Image
                                                    src={'/images/icons/save.svg'}
                                                    width={15}
                                                    height={15}
                                                    alt='saves'
                                                />
                                            }
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