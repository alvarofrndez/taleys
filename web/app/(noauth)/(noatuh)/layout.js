'use client'

import HeaderComponent from '@/components/noAuth/Header'
import styles from '@/assets/noAuth/layout.module.scss'

export default function NoAuthenticatedLayout({ children }) {
    return (
        <>
            <HeaderComponent />
            <main className={styles.main}>
                {children}
            </main>
        </>
    )
}