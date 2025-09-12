'use client'

import styles from '@/assets/auth/projects/characters/view.module.scss'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter, useParams } from 'next/navigation'
import { useProject } from '@/context/ProjectContext'
import Loader from '@/components/Loader'
import { time } from '@/services/time'
import pushToast from '@/utils/pushToast'
import { apiCall } from '@/services/apiCall'
import { openModal } from '@/stores/modalSlice'

import CharacterDetails from '@/components/auth/projects/characters/CharacterDetails'
import CharacterAppearances from '@/components/auth/projects/characters/CharacterAppearances'
import CharacterRelationships from '@/components/auth/projects/characters/CharacterRelationships'
import Icon from '@/components/iconComponent'

const menu_items = [
    { 
        key: 'details', 
        label: 'Detalles', 
        icon: 'info' 
    },
    { 
        key: 'appearances', 
        label: 'Apariciones', 
        icon: 'book' 
    },
    { 
        key: 'relationships', 
        label: 'Relaciones', 
        icon: 'users' 
    }
]

export default function CharacterView({ character }) {
    const user = useSelector((state) => state.auth.user)
    const router = useRouter()
    const params = useParams()
    const dispatch = useDispatch()
    const { project } = useProject()

    const [activeTab, setActiveTab] = useState('details')
    const [loading_delete, setLoadingDelete] = useState(false)
    const [local_character, setLocalCharacter] = useState(character)

    const updateCharacter = (updated_character) => {
        if (updated_character.slug != character.slug) {
            router.replace(
                `/${params.username}/projects/${params.project_slug}/characters/${updated_character.slug}`
            )
        }

        setLocalCharacter(updated_character)
    }

    const openModalDelete = async () => {
        dispatch(openModal({
            component: 'Dialog',
            props: {
                message: '¿Estás seguro de que quieres eliminar este personaje? Esta acción es irreversible.'
            },
            onConfirmCallback: async () => {
                await handleDelete()
            }
        }))
    }

    const handleDelete = async () => {
        setLoadingDelete(true)

        const response = await apiCall(
            'DELETE',
            `/projects/${project.id}/characters/${local_character.id}`
        )

        if (response.success) {
            pushToast(response.message, 'success')
        }

        setLoadingDelete(false)
        router.push(`/${project.created_by.username}/projects/${project.slug}`)
    }

    const getCharacterBelongingText = () => {
        if (!local_character.belonging_object) return 'desconocido'

        const labels = {
            project: 'Proyecto',
            universe: 'Universo',
            saga: 'Saga',
            book: 'Libro',
        }

        const label = labels[local_character.belonging_level] || ''

        let name = ''
        switch (local_character.belonging_level) {
            case 'book':
                name = (local_character.belonging_object).title
                break
            default:
                name = (local_character.belonging_object).name
        }

        return `${label}: ${name}`
    }

    const can_edit = project.members.some((member) => member.user_id === user.id)

    const renderTabContent = () => {
        switch (activeTab) {
            case 'details':
                return <CharacterDetails character={local_character} can_edit={can_edit} onSave={updateCharacter}/>
            case 'appearances':
                return <CharacterAppearances character={local_character} project={project} can_edit={can_edit}/>
            case 'relationships':
                return <CharacterRelationships character={local_character} project={project} can_edit={can_edit}/>
            default:
                return <CharacterDetails character={local_character} />
        }
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.top}>
                    <h2>
                        {local_character.name}
                        {local_character.alias ? ` (${local_character.alias})` : ''}
                    </h2>

                    {can_edit && (
                        <div className={styles.buttonsContainer}>
                            <button className={styles.deleteButton} onClick={openModalDelete}>
                                {loading_delete ? (
                                    <Loader size={15} color='foreground' />
                                ) : (
                                    <span>Eliminar</span>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                <span className={styles.biography}>{local_character.biography ?? <i>Sin biografía</i>}</span>

                <div className={styles.info}>
                    <span className={styles.created_at}>
                        Creado el {local_character.created_at}
                    </span>
                    <div className={styles.separator} />
                    <span className={styles.updated_at}>
                        Actualizado por última vez hace{' '}
                        {time.since(local_character.updated_at_formatted, Date.now())}
                    </span>
                    <div className={styles.separator} />
                    <span className={styles.updated_at}>
                        Pertenece a{' '}
                        {getCharacterBelongingText()}
                    </span>
                </div>
            </header>

            <nav className={styles.tabMenu}>
                {menu_items.map((item) => (
                    <button
                        key={item.key}
                        className={`${styles.tabButton} ${activeTab === item.key ? styles.active : ''}`}
                        onClick={() => setActiveTab(item.key)}
                    >
                        <Icon
                            name={item.icon}
                            width={20}
                            height={20}
                            alt={item.label}
                        />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <main className={styles.main}>
                {renderTabContent()}
            </main>
        </div>
    )
}