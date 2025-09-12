'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useProject } from '@/context/ProjectContext'
import { apiCall } from '@/services/apiCall'
import GlobalLoader from '@/components/GlobalLoader'
import BookFullMode from '@/components/auth/projects/books/BookFullMode'

export default function SagaUniverseViewPage() {
    const router = useRouter()
    const params = useParams()
    const universe_slug = params['universe_slug']
    const saga_slug = params['saga_slug']
    const book_slug = params['book_slug']

    const { project } = useProject()
    const [ book, setBook ] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchBook() {
            setLoading(true)

            const response = await apiCall('GET', `/projects/${project.id}/books/universes/${universe_slug}/sagas/${saga_slug}/books/slug/${book_slug}`)
            if (response.success) {
                setBook(response.data)
            } else {
                router.push('/not-found')
            }
            
            setLoading(false)
        }
        fetchBook()
    }, [universe_slug, saga_slug, book_slug])

    if (loading) return <GlobalLoader />
    if(!book) return <GlobalLoader />

    return (
        <BookFullMode project={project} book={book} />
    )
}