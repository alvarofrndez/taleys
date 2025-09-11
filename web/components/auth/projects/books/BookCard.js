import styles from '@/assets/auth/projects/books/card.module.scss'

import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

export default function BookCard({ project, book }) {
    const router = useRouter()
    const user = useSelector((state) => state.auth.user)

    const gotToBook = () => {
        let partial_url = book.universe && book.saga ? `universes/${book.universe.slug}/sagas/${book.saga.slug}/books/${book.slug}` : book.universe && !book.saga ? `universes/${book.universe.slug}/books/${book.slug}` : !book.universe && book.saga ? `sagas/${book.saga.slug}/books/${book.slug}` : `books/${book.slug}`

        router.push(`/${user.username}/projects/${project.slug}/${partial_url}`)
    }

    return (
        <article className={styles.card} onClick={gotToBook}>
            <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                    📖
                </div>
                <div className={styles.cardBadge}>
                    Libro
                </div>
            </div>
            
            <div className={styles.cardContent}>
                <h4 className={styles.cardTitle}>{book.title}</h4>
                <p className={styles.cardDescription}>
                    {book.synopsis || 'Sin sinopsis'}
                </p>
                <div className={styles.cardMeta}>
                    <div className={styles.metaItem}>
                        <span className={styles.universeLabel}>
                            🌌 {book.universe?.name || 'Sin universo'}
                        </span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.sagaLabel}>
                            📚 {book.saga?.name || 'Sin saga'}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className={styles.cardFooter}>
                <span className={styles.cardDate}>
                    {book.created_at}
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