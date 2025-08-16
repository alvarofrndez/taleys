import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@/assets/auth/users/follow-button.module.scss'
import { apiCall } from '@/services/apiCall'
import pushToast from '@/utils/pushToast'
import LoaderComponent from '@/components/Loader'
import { openModal } from '@/stores/modalSlice'
import { useDispatch } from 'react-redux'

const FollowButton = ({ user_id, target_user_id, is_following, onSuccess = null }) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [followed, setFollowed] = useState(is_following)

    if (!user_id || user_id === target_user_id) {
        return null
    }

    const handleFollow = async () => {
        if(followed){
            dispatch(openModal({
                component: 'Dialog',
                props: {
                    message: '¿Estas seguro de que quieres dejar de seguir a estge usuario?'
                },
                onConfirmCallback: async () => {
                    handleFollowFetch()
                }
            }))
        }else{
            handleFollowFetch()
        }
    }

    const handleFollowFetch = async () => {
        setLoading(true)
        const response = await apiCall('GET', `/users/${target_user_id}/follow`)

        if (!response.success) {
            setLoading(false)
            return
        }

        pushToast(response.message, 'success')
        setFollowed(!followed)

        if (onSuccess) {
            await onSuccess()
        }

        setLoading(false)
    }

    return (
        <button className={styles.follow} onClick={handleFollow} disabled={loading}>
            {loading ? (
                <LoaderComponent size={20} color='foreground' />
            ) : (
                <span>{followed ? 'Siguiendo' : 'Seguir'}</span>
            )}
        </button>
    )
}

export default FollowButton