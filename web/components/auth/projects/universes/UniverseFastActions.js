'use client'

import styles from '@/assets/auth/projects/universes/fast-actions.module.scss'
import { useDispatch } from 'react-redux'
import { openModal } from '@/stores/modalSlice'
import InlineSVG from '@/components/InlineSVG'

export default function UniverseFastActions({ project, universe }) {
    const dispatch = useDispatch()

    const FAST_ACTIONS = [
        {
            icon: '/images/icons/internet.svg',
            color: '#3482d6ff',
            title: 'Nuevo Universo hijo',
            subtitle: `Crea un universo hijo de '${universe.name}'`,
            type: 'universe',
            component: 'CreateUniverseChild'
        },
        {
            icon: '/images/icons/book.svg',
            color: '#e67300ff',
            title: 'Nueva Saga',
            subtitle: 'Inicia una nueva saga',
            type: 'saga',
            component: 'CreateUniverseSaga'
        },
        {
            icon: '/images/icons/book.svg',
            color: '#4caf50ff',
            title: 'Nuevo Libro',
            subtitle: 'Agrega un libro',
            type: 'book',
            component: 'CreateUniverseBook'
        },
        {
            icon: '/images/icons/character.svg',
            color: '#9c27b0ff',
            title: 'Nuevo Personaje',
            subtitle: 'Crea un personaje',
            type: 'character',
            component: 'CreateUniverseCharacter'
        },
        {
            icon: '/images/icons/place.svg',
            color: '#ff4081ff',
            title: 'Nuevo Lugar',
            subtitle: 'Añade un lugar',
            type: 'place',
            component: 'CreateUniversePlace'
        },
        {
            icon: '/images/icons/calendar.svg',
            color: '#ff5722ff',
            title: 'Nuevo Evento',
            subtitle: 'Crea un evento',
            type: 'event',
            component: 'CreateUniverseEvent'
        },
    ]

    const handleActionClick = (type) => {
        dispatch(openModal({
            component: type,
            props: { project, universe }
        }))
    }

    return (
        <section className={styles.container}>
            {FAST_ACTIONS.map(({ icon, color, title, subtitle, type, component }) => (
                <div
                    key={type}
                    className={styles.card}
                    onClick={() => handleActionClick(component)}
                    aria-label={title}
                >
                    <header>
                        <InlineSVG
                            src={icon}
                            color='white'
                            className={styles.icon}
                            style={{ width: 32, height: 32, backgroundColor: color }}
                        />
                        <span className={styles.title}>{title}</span>
                    </header>
                    <span className={styles.subtitle}>{subtitle}</span>
                </div>
            ))}
        </section>
    )
}
