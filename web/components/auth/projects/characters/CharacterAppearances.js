import styles from '@/assets/auth/projects/characters/appearances.module.scss'
import { useState, useEffect } from 'react'
import { apiCall } from '@/services/apiCall'
import Loader from '@/components/Loader'
import { openModal } from '@/stores/modalSlice'
import { useDispatch, useSelector } from 'react-redux'
import Icon from '@/components/iconComponent'
import { useRouter } from 'next/navigation'
import DropdownMenu from '@/components/DropdownMenu'
import pushToast from '@/utils/pushToast'

export default function CharacterAppearances({ character, project, can_edit }) {
    const dispatch = useDispatch()
    const router = useRouter()
    const user = useSelector((state) => state.auth.user)
    const [appearances, setAppearances] = useState(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    useEffect(() => {
        fetchAppearances()
    }, [project.id, character.id])

    const fetchAppearances = async () => {
        setLoading(true)
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

    const getFilteredAppearances = () => {
        if (!appearances) return []
        
        let filtered = appearances

        // Filtrar por término de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(appearance => 
                appearance.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appearance.book.synopsis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appearance.appearance_note?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filtrar por estado del libro (si existe este campo)
        if (statusFilter !== 'all') {
            filtered = filtered.filter(appearance => {
                // Asumiendo que el libro puede tener estados como 'published', 'draft', 'in_progress'
                return appearance.book.status === statusFilter
            })
        }

        return filtered
    }

    const getAppearanceStats = () => {
        if (!appearances) return { total: 0, published: 0, draft: 0, recent: 0 }

        const now = new Date()
        const thirty_days_ago = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))

        return {
            total: appearances.length,
            published: appearances.filter(a => a.book.status === 'published').length,
            draft: appearances.filter(a => a.book.status === 'draft').length,
            recent: appearances.filter(a => new Date(a.created_at) > thirty_days_ago).length
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const openNewAppearance = () => {
        dispatch(openModal({
            component: 'CreateCharacterAppearance',
            props: { project, character, onClose: fetchAppearances },
        }))
    }

    const handleEditAppearance = (appearance) => {
        dispatch(openModal({
            component: 'EditCharacterAppearance',
            props: { 
                project, 
                character, 
                appearance,
                onClose: fetchAppearances 
            },
        }))
    }

    const handleDeleteAppearance = async (appearanceId) => {
        dispatch(openModal({
            component: 'Dialog',
            props: {
                message: '¿Estás seguro de que quieres eliminar esta aparición?'
            },
            onConfirmCallback: async () => {
                setLoading(true)
                const response = await apiCall('DELETE', `/projects/${project.id}/characters/${character.id}/appearances/${appearanceId}`)
                if (response.success) {
                    fetchAppearances()
                    pushToast(response.message || 'Aparición eliminada exitosamente', 'success')
                }
                setLoading(false)
            }
        }))
    }

    const goToBook = (bookSlug) => {
        router.push(`/${user.username}/projects/${project.slug}/books/${bookSlug}`)
    }

    const createDropdownOptions = (appearance) => [
        {
            id: 'edit',
            label: 'Editar',
            icon: 'edit',
            onClick: (e) => {
                e.stopPropagation()
                handleEditAppearance(appearance)
            },
            disabled: !can_edit,
            'data-option-id': 'edit'
        },
        { divider: true },
        {
            id: 'delete',
            label: 'Eliminar',
            icon: 'trash',
            dangerous: 'true',
            onClick: (e) => {
                e.stopPropagation()
                handleDeleteAppearance(appearance.id)
            },
            disabled: !can_edit,
            'data-option-id': 'delete'
        }
    ]

    const getStatusLabel = (status) => {
        switch (status) {
            case 'published': return 'Publicado'
            case 'draft': return 'Borrador'
            case 'in_progress': return 'En Progreso'
            default: return 'Desconocido'
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return styles.statusPublished
            case 'draft': return styles.statusDraft
            case 'in_progress': return styles.statusInProgress
            default: return styles.statusDefault
        }
    }

    if (loading || appearances === null) {
        return (
            <div className={styles.loadingContainer}>
                <Loader size={40} />
                <p>Cargando apariciones...</p>
            </div>
        )
    }

    const filteredAppearances = getFilteredAppearances()
    const appearanceStats = getAppearanceStats()

    return (
        <main className={styles.mainContent}>
            <div className={styles.contentContainer}>
                
                <div className={styles.summaryCard}>
                    <header className={styles.summaryHeader}>
                        <div className={styles.titleContainer}>
                            <h3>Resumen de Apariciones</h3>
                        </div>
                        {can_edit && (
                            <button 
                                className={styles.addButton}
                                onClick={() => openNewAppearance()}
                            >
                                Nueva Aparición
                            </button>
                        )}
                    </header>
                    <div className={styles.summaryContent}>
                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>
                                <div className={`${styles.statNumber} ${styles.totalStat}`}>
                                    {appearanceStats.total}
                                </div>
                                <div className={styles.statLabel}>Total</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={`${styles.statNumber} ${styles.publishedStat}`}>
                                    {appearanceStats.published}
                                </div>
                                <div className={styles.statLabel}>Publicados</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={`${styles.statNumber} ${styles.draftStat}`}>
                                    {appearanceStats.draft}
                                </div>
                                <div className={styles.statLabel}>Borradores</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={`${styles.statNumber} ${styles.recentStat}`}>
                                    {appearanceStats.recent}
                                </div>
                                <div className={styles.statLabel}>Recientes</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.searchAndFilterSection}>
                    <div className={styles.searchContainer}>
                        <Icon
                            name='search'
                            width={16}
                            height={16}
                            alt='Buscar'
                        />
                        <input
                            type="text"
                            placeholder="Buscar por título, sinopsis o notas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                        {searchTerm && (
                            <button
                                className={styles.clearSearch}
                                onClick={() => setSearchTerm('')}
                            >
                                <Icon name='x' width={14} height={14} alt='Limpiar' />
                            </button>
                        )}
                    </div>

                    <div className={styles.filterButtons}>
                        {['all', 'published', 'draft', 'in_progress'].map(status => (
                            <button
                                key={status}
                                className={`${styles.filterButton} ${statusFilter === status ? styles.active : ''}`}
                                onClick={() => setStatusFilter(status)}
                            >
                                {status === 'all' ? 'Todos' : getStatusLabel(status)}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredAppearances.length > 0 ? (
                    <div className={styles.appearancesList}>
                        {filteredAppearances.map((appearance) => (
                            <div 
                                key={appearance.id} 
                                className={styles.appearanceCard}
                                onClick={() => goToBook(appearance.book.slug)}
                            >
                                <header className={styles.appearanceHeader}>
                                    <div className={styles.bookInfo}>
                                        <h3>{appearance.book.title}</h3>
                                        <p className={styles.bookGenre}>{appearance.book.genre}</p>
                                    </div>
                                    <div className={styles.badges}>
                                        <span className={`${styles.statusBadge} ${getStatusColor(appearance.book.status)}`}>
                                            {getStatusLabel(appearance.book.status)}
                                        </span>

                                        {can_edit && (
                                            <DropdownMenu
                                                options={createDropdownOptions(appearance)}
                                                triggerIcon="more-horizontal"
                                                triggerIconSize={18}
                                                ariaLabel={`Opciones para la aparición en ${appearance.book.title}`}
                                            />
                                        )}
                                    </div>
                                </header>

                                <div className={styles.appearanceContent}>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoSection}>
                                            <h4>
                                                <Icon
                                                    name='book'
                                                    width={16}
                                                    height={16}
                                                    alt='Libro'
                                                />
                                                Información del Libro
                                            </h4>
                                            <div className={styles.fieldList}>
                                                <div className={styles.field}>
                                                    <span className={styles.label}>Título:</span>
                                                    <span className={styles.value}>{appearance.book.title}</span>
                                                </div>
                                                <div className={styles.field}>
                                                    <span className={styles.label}>Sinopsis:</span>
                                                    <span className={styles.value}>
                                                        {appearance.book.synopsis || 'Sin sinopsis disponible'}
                                                    </span>
                                                </div>
                                                <div className={styles.field}>
                                                    <span className={styles.label}>Género:</span>
                                                    <span className={styles.value}>
                                                        {appearance.book.genre || 'No especificado'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.infoSection}>
                                            <h4>
                                                <Icon
                                                    name='calendar'
                                                    width={16}
                                                    height={16}
                                                    alt='Fechas'
                                                />
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
                                                {appearance.book.published_at && (
                                                    <div className={styles.field}>
                                                        <span className={styles.label}>Fecha de publicación:</span>
                                                        <span className={styles.value}>{formatDate(appearance.book.published_at)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.notesSection}>
                                        <h4>Notas de Aparición</h4>
                                        <div className={styles.notesContainer}>
                                            <p>
                                                {appearance.note || "No hay notas específicas para esta aparición."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <h3>No se encontraron apariciones</h3>
                        <p>
                            {searchTerm || statusFilter !== 'all'
                                ? 'No hay apariciones que coincidan con los filtros aplicados.'
                                : 'Este personaje aún no tiene apariciones registradas.'
                            }
                        </p>
                        {(searchTerm || statusFilter !== 'all') && (
                            <button 
                                className={styles.clearFiltersButton}
                                onClick={() => {
                                    setSearchTerm('')
                                    setStatusFilter('all')
                                }}
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                )}
            </div>
        </main>
    )
}