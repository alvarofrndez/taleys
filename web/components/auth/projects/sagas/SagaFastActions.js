'use client'

import styles from '@/assets/auth/projects/sagas/fast-actions.module.scss'
import { useDispatch } from 'react-redux'
import { openModal } from '@/stores/modalSlice'
import InlineSVG from '@/components/InlineSVG'

export default function SagaFastActions({ project, saga }) {
    const dispatch = useDispatch()

    const FAST_ACTIONS = [
        {
            icon: '/images/icons/saga.svg',
            color: '#e67300ff',
            title: 'Nueva Saga hija',
            subtitle: `Crea una saga hija de '${saga.name}'`,
            type: 'saga',
            component: 'CreateSagaChild'
        },
        {
            icon: '/images/icons/book.svg',
            color: '#4caf50ff',
            title: 'Nuevo Libro',
            subtitle: 'Agrega un libro',
            type: 'book',
            component: 'CreateSagaBook'
        },
        {
            icon: '/images/icons/character.svg',
            color: '#9c27b0ff',
            title: 'Nuevo Personaje',
            subtitle: 'Crea un personaje',
            type: 'character',
            component: 'CreateSagaCharacter'
        },
        {
            icon: '/images/icons/place.svg',
            color: '#ff4081ff',
            title: 'Nuevo Lugar',
            subtitle: 'Añade un lugar',
            type: 'place',
            component: 'CreateSagaPlace'
        },
        {
            icon: '/images/icons/calendar.svg',
            color: '#ff5722ff',
            title: 'Nuevo Evento',
            subtitle: 'Crea un evento',
            type: 'event',
            component: 'CreateSagaEvent'
        },
    ]

    const handleActionClick = (type) => {
        dispatch(openModal({
            component: type,
            props: { project, saga }
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
