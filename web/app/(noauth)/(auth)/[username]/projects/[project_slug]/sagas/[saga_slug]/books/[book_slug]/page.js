'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useProject } from '@/context/ProjectContext'
import { apiCall } from '@/services/apiCall'
import GlobalLoader from '@/components/GlobalLoader'
import BookFullMode from '@/components/auth/projects/books/BookFullMode'

export default function SagaBookPage() {
    const params = useParams()
    const saga_slug = params['saga_slug']
    const book_slug = params['book_slug']
    const { project } = useProject()
    const [book, setBook] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function fetchBook() {
            const response = await apiCall('GET', `/projects/${project.id}/sagas/${saga_slug}/books/slug/${book_slug}`)
            if (response.success) setBook(response.data)
            else router.push('/not-found')
            setLoading(false)
        }
        fetchBook()
    }, [saga_slug, book_slug])

    if (loading || !book) return <GlobalLoader />
    return <BookFullMode project={project} book={book} />
}
