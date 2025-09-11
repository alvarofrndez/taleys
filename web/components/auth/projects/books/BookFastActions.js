'use client'

import styles from '@/assets/auth/projects/sagas/fast-actions.module.scss'
import { useDispatch } from 'react-redux'
import { openModal } from '@/stores/modalSlice'
import InlineSVG from '@/components/InlineSVG'

export default function BookFastActions({ project, book }) {
	const dispatch = useDispatch()

	const FAST_ACTIONS = [
		{
			icon: '/images/icons/book.svg',
			color: '#4caf50ff',
			title: 'Nuevo Capítulo',
			subtitle: 'Agrega un capítulo',
			type: 'chapter',
			component: 'CreateBookChapter'
		},
		{
			icon: '/images/icons/character.svg',
			color: '#9c27b0ff',
			title: 'Nuevo Personaje',
			subtitle: 'Crea un personaje',
			type: 'character',
			component: 'CreateBookCharacter'
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
			props: { project, book }
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
