'use client'

import styles from '@/assets/auth/settings/layout.module.scss'
import SettingsHeader from '@/components/auth/settings/Header'
import UserAvatar from '@/components/auth/MeAvatar'
import { useSelector } from 'react-redux'

export default function SettingsLayout({ children }) {
    const user = useSelector((state) => state.auth.user)

    return ( user && 
        <div className={styles.container}>
            <header className={styles.header}>
                <UserAvatar />
                <h4>{user.name}</h4>
                <span>( {user.username} )</span>
            </header>
 
            <div className={styles.main}>
                <SettingsHeader />
                <section className={styles.content}>
                    {children}
                </section>
            </div>
        </div>
    )
}