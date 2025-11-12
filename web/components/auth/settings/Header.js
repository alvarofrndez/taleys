'use client'

import Link from 'next/link'
import styles from '@/assets/auth/settings/header.module.scss'
import { usePathname } from 'next/navigation'

const SettingsHeader = () => {
    const BASE_PATH = '/settings'
    const pathname = usePathname()
    
    return (
        <nav className={styles.nav}>
            <Link className={BASE_PATH + '/general' === pathname || BASE_PATH === pathname ? styles.active : ''} href={BASE_PATH + '/general'}>General</Link>
            <section className={styles.section}>
                <h3>seguridad</h3>
                <div>
                    <Link className={BASE_PATH + '/security' === pathname ? styles.active : ''} href={BASE_PATH + '/security'}>Contraseña y autenticación</Link>
                    <Link className={BASE_PATH + '/security' === pathname ? styles.active : ''} href={BASE_PATH + '/security'}>Contraseña y autenticación</Link>
                    <Link className={BASE_PATH + '/security' === pathname ? styles.active : ''} href={BASE_PATH + '/security'}>Contraseña y autenticación</Link>
                    <Link className={BASE_PATH + '/security' === pathname ? styles.active : ''} href={BASE_PATH + '/security'}>Contraseña y autenticación</Link>
                </div>
            </section>
            <section className={styles.section}>
                <h3>seguridad</h3>
                <div>
                    <Link className={BASE_PATH + '/security' === pathname ? styles.active : ''} href={BASE_PATH + '/security'}>Contraseña y autenticación</Link>
                    <Link className={BASE_PATH + '/security' === pathname ? styles.active : ''} href={BASE_PATH + '/security'}>Contraseña y autenticación</Link>
                    <Link className={BASE_PATH + '/security' === pathname ? styles.active : ''} href={BASE_PATH + '/security'}>Contraseña y autenticación</Link>
                    <Link className={BASE_PATH + '/security' === pathname ? styles.active : ''} href={BASE_PATH + '/security'}>Contraseña y autenticación</Link>
                </div>
            </section>
        </nav>
    )
}

export default SettingsHeader