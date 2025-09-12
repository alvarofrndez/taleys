import styles from '@/assets/auth/projects/books/card.module.scss'
import Icon from '@/components/iconComponent'

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
                <div className={styles.cardHeaderIdentifier}>
                    <h3 className={styles.cardTitle}>{book.title}</h3>
                </div>
                <div className={styles.cardBadge}>
                    <span className={styles.cardBadgeType}>libro</span>
                </div>
            </div>
            
            <div className={styles.cardContent}>
                <p className={styles.cardDescription}>
                    {book.synopsis || 'Sin sinopsis'}
                </p>
                <div className={styles.cardMeta}>
                    <div className={styles.metaItem}>
                        <Icon 
                            name='internet'
                            width={12}
                            height={12}
                            alt='Universo'
                            color='var(--color-muted-foreground)'
                        />
                        <span className={styles.universeLabel}>{book.universe?.name || 'Sin universo'}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <Icon 
                            name='saga'
                            width={12}
                            height={12}
                            alt='Saga'
                            color='var(--color-muted-foreground)'
                        />
                        <span className={styles.sagaLabel}>{book.universe?.name || 'Sin saga'}</span>
                    </div>
                </div>
            </div>
            
            <div className={styles.cardFooter}>
                <span className={styles.cardDate}>
                    {book.created_at}
                </span>
            </div>
        </article>
    )
}