'use client'

import styles from '@/assets/auth/layout.module.scss'
import HeaderComponent from "@/components/auth/Header"
import NavigationComponente from "@/components/auth/Navigation"

export default function AuthenticatedLayout({ children }) {
    return (<>
        <HeaderComponent/>
        <main className={styles.main}>
            <NavigationComponente />
            <section className={styles.section}>
                {children}
            </section>
        </main>
    </>)
}