'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useProject } from '@/context/ProjectContext'
import { apiCall } from '@/services/apiCall'
import GlobalLoader from '@/components/GlobalLoader'
import BookView from '@/components/auth/projects/books/BookView'

export default function SagaBookPage() {
    const params = useParams()
    const saga_name = params['saga_name']
    const book_title = params['book_title']
    const { project } = useProject()
    const [book, setBook] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function fetchBook() {
            const response = await apiCall('GET', `/projects/${project.id}/sagas/${saga_name}/books/title/${book_title}`)
            if (response.success) setBook(response.data)
            else router.push('/not-found')
            setLoading(false)
        }
        fetchBook()
    }, [saga_name, book_title])

    if (loading || !book) return <GlobalLoader />
    return <BookView book={book} saga_name={saga_name} />
}
