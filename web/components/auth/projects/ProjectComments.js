// components/ProjectComments.jsx
import { useEffect, useState } from 'react'
import styles from '@/assets/auth/projects/comments.module.scss'
import { useSelector } from 'react-redux'
import pushToast from '@/utils/pushToast'
import { apiCall } from '@/services/apiCall'
import LoaderComponent from '@/components/Loader'
import CommentItem from '@/components/auth/projects/ProjectCommentItem'

export default function ProjectComments({ project = {}, onChange = () => {} }) {
    const [all_comments, setAllComments] = useState([])
    const [new_comment, setNewComment] = useState('')
    const user = useSelector((state) => state.auth.user)
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(false)

    const fetchComments = async () => {
        if (!project.id) return

        setFetching(true)
        const response = await apiCall('GET', `/users/${user?.id}/projects/${project.id}/comments`)
        if (response.success) {
            setAllComments(response.data)
        } else {
            pushToast(response.message, 'error')
        }
        setFetching(false)
    }

    useEffect(() => {
        fetchComments()
    }, [project.id])

    const handleAddComment = async () => {
        if (new_comment.trim() === '') {
            pushToast('Añada un comentario', 'error')
            return
        }

        setLoading(true)
        const response = await apiCall('POST', `/users/${user?.id}/projects/${project.id}/comments`, { content: new_comment })

        if (response.success) {
            setNewComment('')
            fetchComments()
            onChange()
            pushToast(response.message, 'success')
        }

        setLoading(false)
    }

    const handleUpdateComment = (id, updated_comment) => {
        setAllComments((prev) => prev.map((c) => (c.id === id ? updated_comment : c)))
    }

    const handleDeleteComment = (id) => {
        setAllComments((prev) => prev.filter((c) => c.id !== id))
        onChange()
    }

    return (
        <div className={styles.commentsContainer}>
            <ul className={styles.commentList}>
                {fetching ? (
                    <LoaderComponent />
                ) : all_comments.length === 0 ? (
                    <h1 className={styles.noComments}>Este proyecto no tiene comentarios aún.</h1>
                ) : (
                    all_comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            projectId={project.id}
                            onUpdate={handleUpdateComment}
                            onDelete={handleDeleteComment}
                        />
                    ))
                )}
            </ul>

            <div className={styles.commentInput}>
                <textarea
                    placeholder="Escribe un comentario..."
                    value={new_comment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={handleAddComment}>
                    {loading ? <LoaderComponent color="foreground" /> : <span>Publicar</span>}
                </button>
            </div>
        </div>
    )
}
