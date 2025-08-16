import styles from '@/assets/auth/user-item.module.scss'
import { useRouter } from 'next/navigation'
import UserAvatar from '@/components/auth/UserAvatar'

export default function UserItem({user}) {
    const router = useRouter()

    const goToUser = () => {
        router.push(`/users/${user.username}`)
    }

    return (
        <div className={styles.item} onClick={goToUser}>
            <UserAvatar user={user}/>
            <span>{user.username}</span>
        </div>
    )
}