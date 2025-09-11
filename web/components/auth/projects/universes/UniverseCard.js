import styles from '@/assets/auth/projects/universes/card.module.scss'

import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

export default function UniverseCard({ project, universe }) {
    const router = useRouter()
    const user = useSelector((state) => state.auth.user)

    const goToUniverse = () => {
        router.push(`/${user.username}/projects/${project.slug}/universes/${universe.slug}`)
    }

    return (
        <article className={styles.card} onClick={goToUniverse}>
            <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                    🌌
                </div>
                <div className={styles.cardBadge}>
                    Universo
                </div>
            </div>
            
            <div className={styles.cardContent}>
                <h4 className={styles.cardTitle}>{universe.name}</h4>
                <p className={styles.cardDescription}>
                    {universe.description || 'Sin descripción'}
                </p>
            </div>
            
            <div className={styles.cardFooter}>
                <span className={styles.cardDate}>
                    {universe.created_at}
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