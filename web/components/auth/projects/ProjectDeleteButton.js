'use client'

import styles from '@/assets/auth/projects/delete-button.module.scss'
import { useState } from 'react'
import LoaderComponent from '@/components/Loader'
import { apiCall } from '@/services/apiCall'
import { useRouter } from 'next/navigation'
import pushToast from '@/utils/pushToast'
import { openModal } from '@/stores/modalSlice'
import { useDispatch } from 'react-redux'

const ProjectDeleteButton = ({project}) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const openModalDelete = async () => {
        dispatch(openModal({
            component: 'Dialog',
            props: {
                message: '¿Estas seguro de que quieres eliminar este proyecto? es una acción irreversible.'
            },
            onConfirmCallback: async () => {
                await Promise.resolve()
                dispatch(openModal({
                    component: 'DeleteProjectConfirmation',
                    props: { project },
                    onConfirmCallback: async () => {
                        await handleDeleteProject()
                    }
                }))
            }
        }))
    }

    const handleDeleteProject = async () => {
        setLoading(true)

        const response = await apiCall('DELETE', `/projects/${project.id}`)

        if (response.success) {
            goToHome()
        }

        pushToast(response.message, response.success ? 'success' : 'error')

        setLoading(false)
    }

    const goToHome = () => {
        router.replace('/')
    }
      
    return (
        <button className={styles.button} onClick={openModalDelete}>
            {
                loading ?
                    <LoaderComponent size={20} color='foreground'/>
                :
                <span>Eliminar Proyecto</span>
            }
        </button>
    )
}

export default ProjectDeleteButton