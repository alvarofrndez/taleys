// components/CommentItem.jsx
import Image from 'next/image'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { apiCall } from '@/services/apiCall'
import pushToast from '@/utils/pushToast'
import LoaderComponent from '@/components/Loader'
import { useRouter } from 'next/navigation'
import styles from '@/assets/auth/projects/comment-item.module.scss'
import UserAvatar from '@/components/auth/UserAvatar'

export default function CommentItem({ comment, projectId, onUpdate, onDelete }) {
    const user = useSelector((state) => state.auth.user)
    const router = useRouter()
    const [likeLoading, setLikeLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleLike = async () => {
        setLikeLoading(true)

        const response_like = await apiCall('POST', `/users/${user?.id}/projects/${projectId}/comments/${comment.id}/like`)

        if(!response_like.success){
            setLikeLoading(false)
        }

        const response = await apiCall('GET', `/users/${user?.id}/projects/${projectId}/comments/${comment.id}`)

        if (response.success) {
            onUpdate(comment.id, response.data)
        } else {
            pushToast(response.message, 'error')
        }

        setLikeLoading(false)
    }

    const handleDelete = async () => {
        setDeleteLoading(true)

        const response = await apiCall('DELETE', `/users/${user?.id}/projects/${projectId}/comments/${comment.id}`)
        if (response.success) {
            onDelete(comment.id)
        } else {
            pushToast(response.message, 'error')
        }

        setDeleteLoading(false)
    }

    const goToUser = () => {
        router.push(`/users/${comment.created_by.username}`)
    }

    let liked_by_user = comment.likes.some((like) => like.user_id === user?.id)

    return (
        <li className={styles.commentItem}>
            <div className={styles.commentHeader}>
                <UserAvatar user={comment.created_by} />
                <div className={styles.top} >
                    <div className={styles.created}>
                        <div className={styles.createdBy} onClick={goToUser}>
                            <span className={styles.name}>{comment.created_by.name}</span>
                            <span className={styles.username}>{comment.created_by.username}</span>
                        </div>
                        <span className={styles.createdAt}>{comment.created_at}</span>
                    </div>
                    <p className={styles.content}>{comment.content}</p>
                </div>
            </div>

            <div className={styles.commentActions}>
                <div className={styles.commentActionsLike}>
                    {likeLoading ? (
                        <LoaderComponent size={15}/>
                    ) : (
                        <>
                            {liked_by_user ? 
                                <svg onClick={handleLike} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="red" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart h-4 w-4 mr-1 fill-current"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                            : 
                                <svg onClick={handleLike} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart h-4 w-4 mr-1 fill-current"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                            } {comment.likes.length}
                        </>
                    )}
                </div>
                {comment.created_by.id === user?.id && (
                    <div className={styles.commentActionsLike}>
                        {deleteLoading ? 
                            <LoaderComponent size={15} /> 
                        :
                            <Image 
                                src={'/images/icons/trash.svg'}
                                alt='zoom'
                                width={15}
                                height={15}
                                onClick={handleDelete}
                            />
                        }
                    </div>
                )}
            </div>
        </li>
    )
}
