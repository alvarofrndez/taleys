import styles from '@/assets/auth/projects/sagas/card.module.scss'

import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

export default function SagaCard({ project, saga }) {
    const router = useRouter()
    const user = useSelector((state) => state.auth.user)

    const goToSaga = () => {
        let partial_url = saga.universe ? `universes/${saga.universe.slug}/sagas/${saga.slug}` : `sagas/${saga.slug}`

        router.push(`/${user.username}/projects/${project.slug}/${partial_url}`)
    }

    return (
        <article className={styles.card} onClick={goToSaga}>
            <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                    📚
                </div>
                <div className={styles.cardBadge}>
                    Saga
                </div>
            </div>
            
            <div className={styles.cardContent}>
                <h4 className={styles.cardTitle}>{saga.name}</h4>
                <p className={styles.cardDescription}>
                    {saga.description || 'Sin descripción'}
                </p>
                <div className={styles.cardMeta}>
                    <span className={styles.universeLabel}>
                        🌌 {saga.universe?.name || 'Sin universo'}
                    </span>
                </div>
            </div>
            
            <div className={styles.cardFooter}>
                <span className={styles.cardDate}>
                    {saga.created_at}
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