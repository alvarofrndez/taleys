import styles from '@/assets/auth/projects/characters/appearances.module.scss'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { apiCall } from '@/services/apiCall'
import Loader from '@/components/Loader'

export default function CharacterAppearances({ character, project, can_edit }) {
    const [appearances, setAppearances] = useState(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const fetchAppearances = async () => {
            const response = await apiCall(
                'GET',
                `/projects/${project.id}/characters/${character.id}/appearances`
            )
            if (response.success) {
                setAppearances(response.data || [])
            } else {
                setAppearances([])
            }
            setLoading(false)
        }

        fetchAppearances()
    }, [project.id, character.id])

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading || appearances === null) {
        return (
            <div className={styles.loadingContainer}>
                <Loader size={40} />
                <p>Cargando apariciones...</p>
            </div>
        )
    }

    return (
        <main className={styles.mainContent}>
            <div className={styles.contentContainer}>
                <div className={styles.appearancesList}>
                    {appearances.length > 0 ? (
                        appearances.map((appearance) => (
                            <div key={appearance.id} className={styles.appearanceCard}>
                                <header className={styles.appearanceHeader}>
                                    <h3>{appearance.book.title}</h3>
                                    <span className={styles.typeBadge}>
                                        Libro
                                    </span>
                                </header>

                                <div className={styles.appearanceContent}>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoSection}>
                                            <h4>
                                                <Image src="/images/icons/book.svg" alt="Libro" width={16} height={16} />
                                                Información del Libro
                                            </h4>
                                            <div className={styles.fieldList}>
                                                <div className={styles.field}>
                                                    <span className={styles.label}>Título:</span>
                                                    <span className={styles.value}>{appearance.book.title}</span>
                                                </div>
                                                <div className={styles.field}>
                                                    <span className={styles.label}>Sinopsis:</span>
                                                    <span className={styles.value}>{appearance.book.synopsis}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.infoSection}>
                                            <h4>
                                                <Image src="/images/icons/calendar.svg" alt="Fechas" width={16} height={16} />
                                                Fechas
                                            </h4>
                                            <div className={styles.fieldList}>
                                                <div className={styles.field}>
                                                    <span className={styles.label}>Libro creado:</span>
                                                    <span className={styles.value}>{formatDate(appearance.book.created_at)}</span>
                                                </div>
                                                <div className={styles.field}>
                                                    <span className={styles.label}>Aparición registrada:</span>
                                                    <span className={styles.value}>{formatDate(appearance.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.notesSection}>
                                        <h4>Notas de Aparición</h4>
                                        <div className={styles.notesContainer}>
                                            <p>
                                                {appearance.appearance_note || "No hay notas específicas para esta aparición."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <Image src="/images/icons/book-open.svg" alt="Sin apariciones" width={48} height={48} />
                            <h3>No se encontraron apariciones</h3>
                            <p>
                                Este personaje aún no tiene apariciones registradas.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}