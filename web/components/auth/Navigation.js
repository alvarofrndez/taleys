'use client'

import { useSelector } from 'react-redux'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from '@/assets/auth/navigation.module.scss'
import ProjectCreateButton from '@/components/auth/projects/ProjectCreateButton'
import Icon from '@/components/iconComponent'

const NavSection = ({ items, is_active }) => (
  <ul className={styles.section_list}>
    {items.map((item) => (
      <li key={item.name}>
        <Link
          href={item.href}
          className={`${styles.section_item} ${is_active(item.href) ? styles.active : ''}`}
        >
          <Icon name={item.icon} alt={item.icon_alt} width={15} height={15} />
          <span>{item.name}</span>
        </Link>
      </li>
    ))}
  </ul>
)

const Navigation = () => {
  const user = useSelector((state) => state.auth.user)
  const pathname = usePathname()
  const is_active = (path) => pathname.startsWith(path)

  const NAV_SECTIONS = {
    authenticated: [
      {
        key: 'projects',
        items: [
          { name: 'Inicio', href: `/`, icon: 'home', icon_alt: 'Inicio' },
          { name: 'Proyectos', href: (user) => `/${user.username}/projects`, icon: 'project', icon_alt: 'Proyectos' },
          { name: 'Colaboraciones', href: '/collaborations', icon: 'users', icon_alt: 'Colaboraciones' },
          { name: 'Favoritos', href: '/favorites', icon: 'star', icon_alt: 'Favoritos' },
          { name: 'Actividad', href: '/activity', icon: 'activity', icon_alt: 'Actividad reciente' },
        ],
      },
      {
        key: 'explore',
        items: [
          { name: 'Explorar', href: '/explore', icon: 'search', icon_alt: 'Explorar proyectos' },
          { name: 'Historias destacadas', href: '/featured', icon: 'sparkles', icon_alt: 'Proyectos destacados' },
          { name: 'Autores populares', href: '/authors', icon: 'users', icon_alt: 'Autores' },
          { name: 'Categorías', href: '/categories', icon: 'tags', icon_alt: 'Categorías' },
        ],
      },
      {
        key: 'account',
        items: [
          { name: 'Perfil', href: (user) => `/profile/${user.username}`, icon: 'user', icon_alt: 'Tu perfil' },
          { name: 'Ajustes', href: '/settings', icon: 'settings', icon_alt: 'Ajustes' },
        ],
      },
      {
        key: 'info',
        items: [
          { name: 'Guías', href: '/guides', icon: 'book', icon_alt: 'Guías' },
          { name: 'Novedades', href: '/news', icon: 'megaphone', icon_alt: 'Novedades' },
          { name: 'Acerca de', href: '/about', icon: 'info', icon_alt: 'Sobre nosotros' },
          { name: 'Ayuda', href: '/help', icon: 'help', icon_alt: 'Centro de ayuda' },
        ],
      },
    ],

    guest: [
      {
        key: 'explore',
        items: [
          { name: 'Inicio', href: `/`, icon: 'home', icon_alt: 'Inicio' },
          { name: 'Explorar', href: '/explore', icon: 'search', icon_alt: 'Explorar proyectos' },
          { name: 'Historias destacadas', href: '/featured', icon: 'sparkles', icon_alt: 'Proyectos destacados' },
          { name: 'Autores populares', href: '/authors', icon: 'users', icon_alt: 'Autores' },
          { name: 'Categorías', href: '/categories', icon: 'tags', icon_alt: 'Categorías' },
        ],
      },
      {
        key: 'info',
        items: [
          { name: 'Guías', href: '/guides', icon: 'book', icon_alt: 'Guías' },
          { name: 'Novedades', href: '/news', icon: 'megaphone', icon_alt: 'Novedades' },
          { name: 'Acerca de', href: '/about', icon: 'info', icon_alt: 'Sobre nosotros' },
          { name: 'Ayuda', href: '/help', icon: 'help', icon_alt: 'Centro de ayuda' },
        ],
      },
    ],
  }

  const sections = user ? NAV_SECTIONS.authenticated : NAV_SECTIONS.guest

  return (
    <aside className={styles.navigation}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          {sections.map((section, i) => (
            <div key={section.key} className={styles.section}>
              <NavSection
                items={section.items.map((item) => ({
                  ...item,
                  href: typeof item.href === 'function' ? item.href(user) : item.href,
                }))}
                is_active={is_active}
              />

              {i !== sections.length - 1 && <div className={styles.separator}></div>}
            </div>
          ))}
        </nav>

        <footer className={styles.footer}>
          <div className={styles.containerButton}>
            <ProjectCreateButton />
          </div>
        </footer>
      </div>
    </aside>
  )
}

export default Navigation
