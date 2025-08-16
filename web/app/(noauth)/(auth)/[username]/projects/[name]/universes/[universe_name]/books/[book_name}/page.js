'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useProject } from '@/context/ProjectContext'
import { apiCall } from '@/services/apiCall'
import GlobalLoader from '@/components/GlobalLoader'
import BookView from '@/components/auth/projects/books/BookView'

export default function SagaUniverseViewPage() {
    const router = useRouter()
    const params = useParams()
    const universe_name = params['universe_name']
    const book_name = params['book_name']

    const { project, setProject } = useProject()
    const [ book, setSaga ] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchSaga() {
            setLoading(true)

            const response = await apiCall('GET', `/projects/${project.id}/books/universes/${universe_name}/books/name/${book_name}`)
            if (response.success) {
                setSaga(response.data)
            } else {
                router.push('/not-found')
            }
            
            setLoading(false)
        }
        fetchSaga()
    }, [universe_name, book_name])

    if (loading) return <GlobalLoader />
    if(!book) return <GlobalLoader />

    return (
        <BookView book={book} universe_name={universe_name}/>
    )
}