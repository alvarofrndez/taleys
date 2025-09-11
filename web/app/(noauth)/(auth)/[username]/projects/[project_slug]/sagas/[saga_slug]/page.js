'use client'

import styles from '@/assets/auth/projects/sagas/view.module.scss'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useProject } from '@/context/ProjectContext'
import { apiCall } from '@/services/apiCall'
import GlobalLoader from '@/components/GlobalLoader'
import SagaView from '@/components/auth/projects/sagas/SagaView'

export default function UniverseViewPage() {
    const router = useRouter()
    const params = useParams()
    const saga_slug = params['saga_slug']

    const { project, setProject } = useProject()
    const [ saga, setSaga ] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchSaga() {
            setLoading(true)

            const response = await apiCall('GET', `/projects/${project.id}/sagas/slug/${saga_slug}`)
            if (response.success) {
                setSaga(response.data)
            } else {
                router.push('/not-found')
            }
            
            setLoading(false)
        }
        fetchSaga()
    }, [saga_slug])
    
    if (loading) return <GlobalLoader />
    if(!saga) return <GlobalLoader />

    return (
        <SagaView saga={saga} />
    )
}