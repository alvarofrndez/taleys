'use client'

import styles from '@/assets/auth/me-avatar.module.scss'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

const MeAvatar = () => {
    const user = useSelector((state) => state.auth.user)
    const router = useRouter()

    if(user)
        return (
            <div className={styles.userAvatar}>
                {
                    user.avatar_url ?
                        <img src={user.avatar_url} alt='user' onClick={() => router.push(`/users/${user.username}`)}/>
                    :
                        <img src='https://avatar.iran.liara.run/public' alt='user' onClick={() => router.push(`/users/${user.username}`)}/>
                }
            </div>
        )
}

export default MeAvatar