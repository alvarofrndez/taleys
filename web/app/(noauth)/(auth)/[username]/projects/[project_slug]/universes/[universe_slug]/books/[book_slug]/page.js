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
    const universe_slug = params['universe_slug']
    const book_slug = params['book_slug']

    const { project } = useProject()
    const [ book, setBook ] = useState(null)
    const [loading, setLoading] = useState(true)

    console.log(`/projects/${project.id}/books/universes/${universe_slug}/books/slug/${book_slug}`)

    useEffect(() => {
        async function fetchBook() {
            setLoading(true)

            const response = await apiCall('GET', `/projects/${project.id}/books/universes/${universe_slug}/books/slug/${book_slug}`)
            if (response.success) {
                setBook(response.data)
            } else {
                router.push('/not-found')
            }
            
            setLoading(false)
        }
        fetchBook()
    }, [universe_slug, book_slug])

    if (loading) return <GlobalLoader />
    if(!book) return <GlobalLoader />

    return (
        <BookView book={book} universe_slug={universe_slug}/>
    )
}