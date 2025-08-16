import styles from '@/assets/auth/user-avatar.module.scss'
import { useRouter } from 'next/navigation'

export default function UserAvatar({user, width=30, height=30}) {
    const router = useRouter()

    const goToUser = () => {
        router.push(`/users/${user.username}`)
    }

    return (
        <div className={styles.userAvatar} onClick={goToUser}>
            <img src={user.avatar_url ?? 'https://avatar.iran.liara.run/public'} alt={user.username} width={width} height={height}/>
        </div>
    )
}