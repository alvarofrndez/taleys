'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useProject } from '@/context/ProjectContext'
import { apiCall } from '@/services/apiCall'
import GlobalLoader from '@/components/GlobalLoader'
import SagaFullMode from '@/components/auth/projects/sagas/SagaFullMode'

export default function SagaUniverseViewPage() {
    const router = useRouter()
    const params = useParams()
    const universe_slug = params['universe_slug']
    const saga_slug = params['saga_slug']

    const { project } = useProject()
    const [ saga, setSaga ] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchSaga() {
            setLoading(true)

            const response = await apiCall('GET', `/projects/${project.id}/sagas/universes/${universe_slug}/sagas/slug/${saga_slug}`)
            if (response.success) {
                setSaga(response.data)
            } else {
                router.push('/not-found')
            }
            
            setLoading(false)
        }
        fetchSaga()
    }, [universe_slug, saga_slug])

    if (loading) return <GlobalLoader />
    if(!saga) return <GlobalLoader />

    return (
        <SagaFullMode project={project} saga={saga} />
    )
}