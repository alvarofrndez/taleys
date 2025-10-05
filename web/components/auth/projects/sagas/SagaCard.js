import styles from '@/assets/auth/projects/sagas/card.module.scss'
import Icon from '@/components/iconComponent'

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
                <div className={styles.cardHeaderIdentifier}>
                    <h3 className={styles.cardTitle}>{saga.name}</h3>
                </div>
                <div className={styles.cardBadge}>
                    <span className={styles.cardBadgeType}>saga</span>
                </div>
            </div>
            
            <div className={styles.cardContent}>
                <p className={styles.cardDescription}>
                    {saga.description || 'Sin descripción'}
                </p>
                <div className={styles.cardMeta}>
                    { saga.universe &&
                        <div className={styles.metaItem}>
                            <Icon 
                                name='internet'
                                width={12}
                                height={12}
                                alt='Universo'
                                color='var(--color-muted-foreground)'
                            />
                            <span className={styles.universeLabel}>{saga.universe.name}</span>
                        </div>
                    }
                    { saga.parent_saga &&
                        <div className={styles.metaItem}>
                            <Icon 
                                name='saga'
                                width={12}
                                height={12}
                                alt='Saga'
                                color='var(--color-muted-foreground)'
                            />
                            <span className={styles.sagaLabel}>{saga.parent_saga.name}</span>
                        </div>
                    }
                    
                </div>
            </div>
            
            <div className={styles.cardFooter}>
                <span className={styles.cardDate}>
                    {saga.created_at}
                </span>
            </div>
        </article>
    )
}