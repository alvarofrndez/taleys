'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useProject } from '@/context/ProjectContext'
import { apiCall } from '@/services/apiCall'
import GlobalLoader from '@/components/GlobalLoader'
import UniverseFullMode from '@/components/auth/projects/universes/UniverseFullMode'

export default function UniverseViewPage() {
    const router = useRouter()
    const params = useParams()
    const universe_slug = params['universe_slug']

    const { project } = useProject()
    const [ universe, setUniverse ] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUniverse() {
            setLoading(true)
            const response = await apiCall('GET', `/projects/${project.id}/universes/slug/${universe_slug}`)
            if (response.success) {
                setUniverse(response.data)
            } else {
                router.push('/not-found')
            }
            setLoading(false)
        }
        fetchUniverse()
    }, [universe_slug])
    
    if (loading) return <GlobalLoader />
    if(!universe) return <GlobalLoader />

    return (
        <UniverseFullMode project={project} universe={universe} />
    )
}