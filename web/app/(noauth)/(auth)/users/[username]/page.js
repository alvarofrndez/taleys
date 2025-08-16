'use client'

import styles from '@/assets/auth/users/view.module.scss'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import GlobalLoader from '@/components/GlobalLoader'
import LoaderComponent from '@/components/Loader'
import { apiCall } from '@/services/apiCall'
import { useRouter, useParams } from 'next/navigation'
import pushToast from '@/utils/pushToast'
import Image from 'next/image'
import UserProjectsList from '@/components/auth/users/projectsList'
import FollowButton from '@/components/auth/users/follow'
import UserAvatar from '@/components/auth/UserAvatar'

export default function UserViewPage() {
    const router = useRouter()
    const params = useParams()
    const username = params['username']
    const user = useSelector((state) => state.auth.user)
    const [user_page, setUserPage] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [loading_follow, setLoadingFollow] = useState(false)
    const [loading_message, setLoadingMessage] = useState(false)
    const [follow_by_user, setFollowByUser] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            const response = await apiCall('GET', `/users/username/${username}`)

            if(response.success){
                setUserPage(response.data)
                setInfoOfUser(response, response.data)
            }else{
                router.push('/not-found')
            }
            setLoading(false)
        }

        fetchUser()
    }, [username])

    const fetchUser = async () => {
        const response = await apiCall('GET', `/users/${user_page.id}`)

        if(response.success){
            setUserPage(response.data)
        }

        setInfoOfUser(response, response.data)
    }

    const setInfoOfUser = (response, data) => {
        if (response.success && data.followers) {
            setFollowByUser(data.followers.some((follower) => follower.id === user?.id))
        }
    }

    const handleMessage = () => {

    }

    const goToSettings = () => {
        router.push('/settings')
    }

    if(loading){
        return <GlobalLoader />
    }

    return ( user_page &&
        <div className={styles.container}>
            <header className={styles.header}>
                <img className={styles.backgroundImage} src={user_page?.url_banner ? user_page.url_banner : '/images/placeholder.svg'} alt={user_page.username + 'banner'}/>

                <div className={styles.info}>
                    <div className={styles.user}>
                        <UserAvatar user={user_page} width={50} height={50}/>
                        <div className={styles.userInfo}>
                            <div className={styles.userInfoTop}>
                                <h2 className={styles.name}>{user_page.name}</h2>
                                {
                                    user_page?.verify ?
                                        <span className={styles.verify}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3 mr-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                            <span>Verificado</span>
                                        </span>
                                    :
                                        <span className={styles.notVerify}>Sin verificar</span>
                                }
                            </div>
                            <div className={styles.userInfoBottom}>
                                <p className={styles.username}>@{user_page.username}</p>
                                {
                                    user?.id != user_page.id ?
                                    <div className={styles.userInfoBottomActions}>
                                        <FollowButton 
                                            user_id={user?.id}
                                            target_user_id={user_page.id}
                                            is_following={follow_by_user}
                                            onSuccess={fetchUser}
                                        />
                                        <button className={styles.userInfoBottomActionsMessage} onClick={handleMessage}>
                                            {loading_message ? (
                                                <LoaderComponent size={20}/>
                                            ) : (
                                                <span>Mensaje</span>
                                            )}
                                        </button>
                                    </div>
                                    :
                                    null
                                }
                                {
                                    user?.id == user_page.id ?
                                    <div className={styles.userInfoBottomActions}>
                                        <button className={styles.userInfoBottomActionsMessage} onClick={goToSettings}>
                                            <span>Ajustes</span>
                                        </button>
                                    </div>
                                    :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            {loading_follow ? (
                                <LoaderComponent/>
                            ) : (
                                <h1>{user_page.followers?.length ?? 0}</h1>
                            )}
                            <span className={styles.statItemLabel}>Seguidores</span>
                        </div>
                        <div className={styles.statItem}>
                            <h1>{user_page.follows?.length ?? 0}</h1>
                            <span className={styles.statItemLabel}>Siguiendo</span>
                        </div>
                        <div className={styles.statItem}>
                            <h1>{user_page.projects?.length ?? 0}</h1>
                            <span className={styles.statItemLabel}>Proyectos</span>
                        </div>
                    </div>
                </div>
            </header>
            <section className={styles.section}>
                <aside className={styles.about}>
                    <div className={styles.aboutItem}>
                        <h3 className={styles.aboutTitle}>Sobre mí</h3>
                        <span className={styles.aboutDescriptionContent}>{user_page.description}</span>
                    </div>
                    <div className={styles.aboutItem}>
                        <h3 className={styles.aboutTitle}>Información</h3>
                        <div className={styles.aboutInfoItem}>
                            <Image 
                                src='/images/icons/location.svg'
                                width={20}
                                height={20}
                                alt='ubicación'
                            />
                            <span>{user_page.location ?? <span className={styles.aboutInfoItemUndefined}>sin definir</span>}</span>
                        </div>
                        <div className={styles.aboutInfoItem}>
                            <Image 
                                src='/images/icons/github.svg'
                                width={20}
                                height={20}
                                alt='github logo'
                            />
                            {
                                user_page.github ?
                                    <a href={user_page.github} target='_blank'>
                                        <span>{user_page.github}</span>
                                        <Image 
                                            src='/images/icons/navigateFlashy.svg'
                                            width={12}
                                            height={12}
                                            alt='navigate'
                                        />
                                    </a>
                                :
                                    <span className={styles.aboutInfoItemUndefined}>sin definir</span>
                            }
                        </div>
                        <div className={styles.aboutInfoItem}>
                            <Image 
                                src='/images/icons/instagram.svg'
                                width={20}
                                height={20}
                                alt='instagram logo'
                            />
                            {
                                user_page.instagram ?
                                    <a href={user_page.instagram} target='_blank'>
                                        <span>{user_page.instagram}</span>
                                        <Image 
                                            src='/images/icons/navigateFlashy.svg'
                                            width={12}
                                            height={12}
                                            alt='navigate'
                                        />
                                    </a>
                                :
                                    <span className={styles.aboutInfoItemUndefined}>sin definir</span>
                            }
                        </div>
                        <div className={styles.aboutInfoItem}>
                            <Image 
                                src='/images/icons/x.svg'
                                width={20}
                                height={20}
                                alt='x logo'
                            />
                            {
                                user_page.x ?
                                    <a href={user_page.x} target='_blank'>
                                        <span>{user_page.x}</span>
                                        <Image 
                                            src='/images/icons/navigateFlashy.svg'
                                            width={12}
                                            height={12}
                                            alt='navigate'
                                        />
                                    </a>
                                :
                                    <span className={styles.aboutInfoItemUndefined}>sin definir</span>
                            }
                        </div>
                        <div className={styles.aboutInfoItem}>
                            <Image 
                                src='/images/icons/linkedin.svg'
                                width={20}
                                height={20}
                                alt='linkedin logo'
                            />
                            {
                                user_page.linkedin ?
                                    <a href={user_page.linkedin} target='_blank'>
                                        <span>{user_page.linkedin}</span>
                                        <Image 
                                            src='/images/icons/navigateFlashy.svg'
                                            width={12}
                                            height={12}
                                            alt='navigate'
                                        />
                                    </a>
                                :
                                    <span className={styles.aboutInfoItemUndefined}>sin definir</span>
                            }
                        </div>
                        <div className={styles.aboutInfoItem}>
                            <Image 
                                src='/images/icons/internet.svg'
                                width={20}
                                height={20}
                                alt='internet'
                            />
                            {
                                user_page.web ?
                                    <a href={user_page.web} target='_blank'>
                                        <span>{user_page.web}</span>
                                        <Image 
                                            src='/images/icons/navigateFlashy.svg'
                                            width={12}
                                            height={12}
                                            alt='navigate'
                                        />
                                    </a>
                                :
                                    <span className={styles.aboutInfoItemUndefined}>sin definir</span>
                            }
                        </div>
                        <div className={styles.aboutInfoItem}>
                            <Image 
                                src='/images/icons/calendar.svg'
                                width={20}
                                height={20}
                                alt='calendario'
                            />
                            <span>Se unió el {user_page.created_at}</span>
                        </div>
                    </div>
                </aside>
                <section className={styles.projects}>
                    <UserProjectsList projects={user_page.projects} />
                </section>
            </section>
    </div>
    )
}