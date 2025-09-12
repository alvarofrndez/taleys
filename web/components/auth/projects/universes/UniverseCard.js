import styles from '@/assets/auth/projects/universes/card.module.scss'
import Icon from '@/components/iconComponent'

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
                <div className={styles.cardHeaderIdentifier}>
                    <h3 className={styles.cardTitle}>{universe.name}</h3>
                </div>
                <div className={styles.cardBadge}>
                    <span className={styles.cardBadgeType}>universo</span>
                </div>
            </div>
            
            <div className={styles.cardContent}>
                <p className={styles.cardDescription}>
                    {universe.description || 'Sin descripción'}
                </p>
            </div>
            
            <div className={styles.cardFooter}>
                <span className={styles.cardDate}>
                    {universe.created_at}
                </span>
            </div>
        </article>
    )
}