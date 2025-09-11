import styles from '@/assets/auth/projects/characters/card.module.scss'

import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

export default function UniverseCard({ project, character }) {
    const router = useRouter()
    const user = useSelector((state) => state.auth.user)

    const goToCharacter = () => {
        router.push(`/${user.username}/projects/${project.slug}/characters/${character.slug}`)
    }

    return (
        <article className={styles.card} onClick={goToCharacter}>
            <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                    🌌
                </div>
                <div className={styles.cardBadge}>
                    Personaje
                </div>
            </div>
            
            <div className={styles.cardContent}>
                <h4 className={styles.cardTitle}>{character.name}</h4>
                <p className={styles.cardDescription}>
                    {character.biography || 'Sin biografía'}
                </p>
            </div>
            
            <div className={styles.cardFooter}>
                <span className={styles.cardDate}>
                    {character.created_at}
                </span>
                <div className={styles.cardActions}>
                    <button className={styles.actionButton}>
                        Ver detalles
                    </button>
                </div>
            </div>
        </article>
    )
}