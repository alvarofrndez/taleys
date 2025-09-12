'use client'

import styles from '@/assets/auth/projects/full-mode.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { apiCall } from '@/services/apiCall'
import { apiShare } from '@/services/apiShare'
import { time } from '@/services/time'
import { openModal } from '@/stores/modalSlice'
import Image from 'next/image'
import { useState } from 'react'
import LoaderComponent from '@/components/Loader'
import pushToast from '@/utils/pushToast'
import ProjectSummary from '@/components/auth/projects/ProjectSummary'
import ProjectContent from '@/components/auth/projects/ProjectContent'
import Icon from '@/components/iconComponent'

const menu_items = [
    { 
        key: 'summary', 
        label: 'Resumen', 
        icon: 'info' 
    },
    { 
        key: 'content', 
        label: 'Contenido', 
        icon: 'book' 
    },
]


export default function ProjectFullMode({ project }) {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const [loading_visibility, setLoadingVisibility] = useState(false)
    const [active_tab, setActiveTab] = useState('summary')

    const handleChangeVisibility = () => {
        dispatch(openModal({
            component: 'Dialog',
            props: {
                message: `¿Estás seguro de que quieres cambiar la visibilidad de tu proyecto a ${project.visibility === 'private' ? "'Público'" : "'Privado'"}?.`
            },
            onConfirmCallback: async () => {
                setLoadingVisibility(true)
                project.visibility = project.visibility === 'public' ? 'private' : 'public'
                const response = await apiCall('PUT', `/projects/${project.id}`, project)

                pushToast(response.message, response.success ? 'success' : 'error')
                setLoadingVisibility(false)
            }
        }))
    }

    const share = () => {
        apiShare.share({
            title: project.name,
            text: project.description,
            url: `${window.location.origin}/projects/${project.name}?id=${project.id}`
        })
    }

    return (
        <section className={styles.container}>
            <header className={styles.header}>
                <div className={styles.top}>
                    <h2>{project.name}</h2>
                    <div className={styles.topActions}>
                        {project.members.some((member) => member.user_id === user.id) && (
                            loading_visibility ? (
                                <button className={styles.topActionsVisibility}>
                                    <LoaderComponent size={20} />
                                </button>                                
                            ) : (
                                <button
                                    className={styles.topActionsVisibility}
                                    onClick={handleChangeVisibility}
                                >
                                    <Icon
                                        name={project.visibility === 'public' ? 'show' : 'hide'}
                                        width={15}
                                        height={15}
                                        alt='visibilidad'
                                    />
                                    <span>{project.visibility === 'public' ? 'Público' : 'Privado'}</span>
                                </button>
                            )
                        )}
                        <button className={styles.topActionsShare} onClick={share}>
                            <Icon
                                name='share'
                                width={15}
                                height={15}
                                alt='compartir'
                            />
                            <span>Compartir</span>
                        </button>
                    </div>
                </div>
                <span className={styles.description}>{project.description}</span>
                <div className={styles.info}>
                    <span className={styles.created_at}>Creado el {project.created_at}</span>
                    <div className={styles.separator}/>
                    <span className={styles.updated_at}>
                        Actualizado por última vez hace {time.since(project.updated_at_formatted, Date.now())}
                    </span>
                    <div className={styles.separator}/>
                    <span className={styles.members}>
                        {`${project.members.length} miembro${project.members.length > 1 ? 's' : ''}`}
                    </span>
                </div>
            </header>

            <div className={styles.main}>
                <nav className={styles.tabMenu}>
                    {menu_items.map((item) => (
                        <button
                            key={item.key}
                            className={`${styles.tabButton} ${active_tab === item.key ? styles.active : ''}`}
                            onClick={() => setActiveTab(item.key)}
                        >
                            <Icon
                                name={item.icon}
                                alt={item.label}
                                width={15}
                                height={15}
                            />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className={styles.component}>
                    {active_tab === 'summary' && <ProjectSummary project={project} />}
                    {active_tab === 'content' && <ProjectContent project={project} />}
                </div>
            </div>

        </section>
    )
}
