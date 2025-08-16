'use client'

import styles from '@/assets/auth/layout.module.scss'
import HeaderComponent from "@/components/auth/Header"

export default function AuthenticatedLayout({ children }) {
    return (<>
        <HeaderComponent />
        <main className={styles.main}>{children}</main>
    </>)
}