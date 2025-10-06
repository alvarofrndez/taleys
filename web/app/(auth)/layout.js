'use client'

import styles from '@/assets/auth/layout.module.scss'
import HeaderComponent from "@/components/auth/Header"
import NavigationComponente from "@/components/auth/Navigation"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import GlobalLoader from '@/components/GlobalLoader'

export default function AuthenticatedLayout({ children }) {
    const router = useRouter()
    const user = useSelector((state) => state.auth.user)
    const [loading, setLoading] = useState(true)
  
    useEffect(() => {
        if(!user){
            router.replace('/')
            setTimeout(() => {
                setLoading(false)
            }, 2000)
        }else{
            setLoading(false)
        }
    }, [user])

    if (loading)
        return <GlobalLoader />

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