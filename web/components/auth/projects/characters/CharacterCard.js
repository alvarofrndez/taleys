import styles from '@/assets/auth/projects/characters/card.module.scss'
import Icon from '@/components/iconComponent'

import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

export default function CharacterCard({ project, character }) {
    const router = useRouter()
    const user = useSelector((state) => state.auth.user)

    const goToCharacter = () => {
        router.push(`/${user.username}/projects/${project.slug}/characters/${character.slug}`)
    }

    return (
        <article className={styles.card} onClick={goToCharacter}>
            <div className={styles.cardHeader}>
                <div className={styles.cardHeaderIdentifier}>
                    <h3 className={styles.cardTitle}>{character.name}</h3>
                </div>
                <div className={styles.cardBadge}>
                    <span className={styles.cardBadgeType}>personaje</span>
                </div>
            </div>
            
            <div className={styles.cardContent}>
                <p className={styles.cardDescription}>
                    {character.biography || 'Sin biografía'}
                </p>
               <div className={styles.cardMeta}>
                    {character.belonging_level === 'book' && character.belonging_object && (
                        <div className={styles.metaItem}>
                            <Icon 
                                name='book'
                                width={12}
                                height={12}
                                alt='Libro'
                                color='var(--color-muted-foreground)'
                            />
                            <span className={styles.typeLabel}>{character.belonging_object.title}</span>
                        </div>
                    )}
                    {character.belonging_level === 'saga' && character.belonging_object && (
                        <div className={styles.metaItem}>
                            <Icon 
                                name='saga'
                                width={12}
                                height={12}
                                alt='Saga'
                                color='var(--color-muted-foreground)'
                            />
                            <span className={styles.typeLabel}>{character.belonging_object.name || character.belonging_object.title}</span>
                        </div>
                    )}
                    {character.belonging_level === 'universe' && character.belonging_object && (
                        <div className={styles.metaItem}>
                            <Icon 
                                name='internet'
                                width={12}
                                height={12}
                                alt='Universo'
                                color='var(--color-muted-foreground)'
                            />
                            <span className={styles.typeLabel}>{character.belonging_object.name || character.belonging_object.title}</span>
                        </div>
                    )}
                </div>
            </div>
            
            <div className={styles.cardFooter}>
                <span className={styles.cardDate}>
                    {character.created_at}
                </span>
            </div>
        </article>
    )
}