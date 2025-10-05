'use client'

import { useSelector } from 'react-redux'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from '@/assets/auth/navigation.module.scss'
import Image from 'next/image'
import ProjectCreateButton from '@/components/auth/projects/ProjectCreateButton'
import Icon from '../iconComponent'

const nav_items = [
  { name: 'Sagas', href: '/sagas', icon: 'close', icon_alt: 'sagas' },
  { name: 'Libros', href: '/books', icon: 'close', icon_alt: 'sagas' },
  { name: 'Personajes', href: '/characters', icon: 'close', icon_alt: 'sagas' },
  { name: 'Lugares', href: '/locations', icon: 'close', icon_alt: 'sagas'},
  { name: 'Eventos', href: '/events', icon: 'close', icon_alt: 'sagas'},
  { name: 'Notas del autor', href: '/notes', icon: 'close', icon_alt: 'sagas'},
]

const Navigation = () => {
  const user = useSelector((state) => state.auth.user)
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path) => pathname.startsWith(path)

  return (
    <aside className={styles.navigation}>
      <div className={styles.container}>
        <header className={styles.name}>
          <h2>Cosmere</h2>
        </header>
  
        <nav className={styles.nav}>
          {nav_items.map((item) => (
            <Link key={item.name} href={item.href} className={`${styles.nav_item} ${isActive(item.href) ? styles.active : ''}`}>
              <Icon
                  name={item.icon}
                  alt='close'
                  width={15}
                  height={15}
                  className={styles.closeButton}
              />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
  
        <footer className={styles.footer}>
          <ProjectCreateButton />
        </footer>
      </div>
    </aside>
  )
}

export default Navigation
