import styles from '@/assets/auth/projects/characters/relationships.module.scss'
import { useState, useEffect } from 'react'
import { apiCall } from '@/services/apiCall'
import Loader from '@/components/Loader'
import { openModal } from '@/stores/modalSlice'
import { useDispatch, useSelector } from 'react-redux'
import Icon from '@/components/iconComponent'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import DropdownMenu from '@/components/DropdownMenu'
import pushToast from '@/utils/pushToast'

export default function CharacterRelationships({ character, project, can_edit }) {
    const dispatch = useDispatch()
    const router = useRouter()
    const user = useSelector((state) => state.auth.user)
    const [relationships, setRelationships] = useState(null)
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchRelationships()
    }, [project.id, character.id])

    const fetchRelationships = async () => {
        setLoading(true)
        const response = await apiCall('GET', `/projects/${project.id}/characters/${character.id}/relationships`)
        if (response.success) {
            setRelationships(response.data || [])
        } else {
            setRelationships([])
        }
        setLoading(false)
    }

    const getFilteredRelationships = () => {
        if (!relationships) return []
        
        let filtered = relationships

        // Filtrar por término de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(relationship => 
                relationship.related_character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                relationship.related_character.alias?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                relationship.related_character.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                relationship.related_character.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                relationship.note?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filtrar por tipo de relación
        if (filter !== 'all') {
            filtered = filtered.filter(relationship => relationship.relation_type === filter)
        }

        return filtered
    }

    const getRelationshipStats = () => {
        if (!relationships) return { total: 0, allies: 0, enemies: 0, recent: 0 }

        const now = new Date()
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))

        return {
            total: relationships.length,
            allies: relationships.filter(r => r.relation_type === 'ally').length,
            enemies: relationships.filter(r => r.relation_type === 'enemy').length,
            recent: relationships.filter(r => new Date(r.created_at) > thirtyDaysAgo).length
        }
    }

    const getRelationshipIcon = (type) => {
        switch (type) {
            case 'ally': return 'users'
            case 'enemy': return 'sword'
            case 'family': return 'heart'
            case 'romantic': return 'heart-filled'
            case 'mentor': return 'graduation-cap'
            case 'neutral': return 'user'
            default: return 'users'
        }
    }

    const getRelationshipTypeLabel = (type) => {
        switch (type) {
            case 'ally': return 'Aliado'
            case 'enemy': return 'Enemigo'
            case 'family': return 'Familia'
            case 'romantic': return 'Romántica'
            case 'mentor': return 'Mentor'
            case 'neutral': return 'Neutral'
            default: return 'Desconocida'
        }
    }

    const getIntensityLabel = (intensity) => {
        switch (intensity) {
            case 'low': return 'Baja'
            case 'medium': return 'Media'
            case 'high': return 'Alta'
            case 'extreme': return 'Extrema'
            default: return 'No especificada'
        }
    }

    const getIntensityColor = (intensity) => {
        switch (intensity) {
            case 'low': return styles.intensityLow
            case 'medium': return styles.intensityMedium
            case 'high': return styles.intensityHigh
            case 'extreme': return styles.intensityExtreme
            default: return styles.intensityDefault
        }
    }

    const openNewRelationship = () => {
        dispatch(openModal({
            component: 'CreateCharacterRelationship',
            props: { project, character, onClose: fetchRelationships },
        }))
    }

    const handleEditRelationship = (relationship) => {
        dispatch(openModal({
            component: 'EditCharacterRelationship',
            props: { 
                project, 
                character, 
                relationship,
                onClose: fetchRelationships 
            },
        }))
    }

    const handleDeleteRelationship = async (relationshipId) => {
        dispatch(openModal({
            component: 'Dialog',
            props: {
                message: '¿Estás seguro de que quieres eliminar esta relación?'
            },
            onConfirmCallback: async () => {
                setLoading(true)
                const response = await apiCall('DELETE', `/projects/${project.id}/characters/${character.id}/relationships/${relationshipId}`)
                if (response.success) {
                    fetchRelationships()
                    pushToast(response.message || 'Relación eliminada exitosamente', 'success')
                } else {
                    pushToast(response.message || 'Error al eliminar la relación', 'error')
                }
                setLoading(false)
            }
        }))
    }

    const createDropdownOptions = (relationship) => [
        {
            id: 'edit',
            label: 'Editar',
            icon: 'edit',
            onClick: (e) => {
                e.stopPropagation()
                handleEditRelationship(relationship)
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
                handleDeleteRelationship(relationship.id)
            },
            disabled: !can_edit,
            'data-option-id': 'delete'
        }
    ]

    const goToCharacter = (slug) => {
        router.push(`/${user.username}/projects/${project.slug}/characters/${slug}`)
    }

    if (loading || relationships === null) {
        return (
            <div className={styles.loadingContainer}>
                <Loader size={40} />
                <p>Cargando relaciones...</p>
            </div>
        )
    }

    const filteredRelationships = getFilteredRelationships()
    const relationshipStats = getRelationshipStats()

    return (
        <main className={styles.mainContent}>
            <div className={styles.contentContainer}>
                
                <div className={styles.summaryCard}>
                    <header className={styles.summaryHeader}>
                        <div className={styles.titleContainer}>
                            <Icon
                                name='users'
                                width={20}
                                height={20}
                                alt='Resumen'
                            />
                            <h3>Resumen de Relaciones</h3>
                        </div>
                        {can_edit && (
                            <button 
                                className={styles.addButton}
                                onClick={() => openNewRelationship()}
                            >
                                Nueva Relación
                            </button>
                        )}
                    </header>
                    <div className={styles.summaryContent}>
                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>
                                <div className={`${styles.statNumber} ${styles.totalStat}`}>
                                    {relationshipStats.total}
                                </div>
                                <div className={styles.statLabel}>Total</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={`${styles.statNumber} ${styles.alliesStat}`}>
                                    {relationshipStats.allies}
                                </div>
                                <div className={styles.statLabel}>Aliados</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={`${styles.statNumber} ${styles.enemiesStat}`}>
                                    {relationshipStats.enemies}
                                </div>
                                <div className={styles.statLabel}>Enemigos</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={`${styles.statNumber} ${styles.recentStat}`}>
                                    {relationshipStats.recent}
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
                            placeholder="Buscar por nombre, alias, rol o notas..."
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
                        {['all', 'ally', 'enemy', 'family', 'romantic', 'mentor', 'neutral'].map(type => (
                            <button
                                key={type}
                                className={`${styles.filterButton} ${filter === type ? styles.active : ''}`}
                                onClick={() => setFilter(type)}
                            >
                                {type === 'all' ? 'Todas' : getRelationshipTypeLabel(type)}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredRelationships.length > 0 ? (
                    <div className={styles.relationshipsList}>
                        {filteredRelationships.map((relationship) => (
                            <div 
                                key={relationship.id} 
                                className={styles.relationshipCard} 
                                onClick={() => goToCharacter(relationship.related_character.slug)}
                            >
                                <header className={styles.relationshipHeader}>
                                    <div className={styles.characterInfo}>
                                        <div className={styles.characterAvatar}>
                                            <Image
                                                src={relationship.related_character.image_url ?? '/images/placeholder.svg'}
                                                alt={relationship.related_character.name}
                                                width={50}
                                                height={50}
                                            />
                                        </div>
                                        <div className={styles.characterDetails}>
                                            <h3>{relationship.related_character.name}</h3>
                                            <p>{relationship.related_character.alias}</p>
                                        </div>
                                    </div>
                                    <div className={styles.badges}>
                                        <span className={styles.typeBadge}>
                                            <Icon
                                                name={getRelationshipIcon(relationship.relation_type)}
                                                width={12}
                                                height={12}
                                                alt={relationship.relation_type}
                                            />
                                            {getRelationshipTypeLabel(relationship.relation_type)}
                                        </span>
                                        <span>·</span>
                                        <span className={`${styles.intensityBadge} ${getIntensityColor(relationship.intensity)}`}>
                                            {getIntensityLabel(relationship.intensity)}
                                        </span>

                                        {can_edit && (
                                            <DropdownMenu
                                                options={createDropdownOptions(relationship)}
                                                triggerIcon="more-horizontal"
                                                triggerIconSize={18}
                                                ariaLabel={`Opciones para la relación con ${relationship.related_character.name}`}
                                            />
                                        )}
                                    </div>
                                </header>

                                <div className={styles.relationshipContent}>
                                    <div className={styles.infoGrid}>
                                        <div className={styles.infoSection}>
                                            <h4>
                                                <Icon
                                                    name='user'
                                                    width={16}
                                                    height={16}
                                                    alt='Personaje'
                                                />
                                                Información del Personaje
                                            </h4>
                                            <div className={styles.fieldList}>
                                                <div className={styles.field}>
                                                    <span className={styles.label}>Nombre:</span>
                                                    <span className={styles.value}>{relationship.related_character.name}</span>
                                                </div>
                                                <div className={styles.field}>
                                                    <span className={styles.label}>Alias:</span>
                                                    <span className={styles.value}>
                                                        {relationship.related_character.alias || 'Sin alias'}
                                                    </span>
                                                </div>
                                                <div className={styles.field}>
                                                    <span className={styles.label}>Rol:</span>
                                                    <span className={styles.value}>
                                                        {relationship.related_character.role || 'No especificado'}
                                                    </span>
                                                </div>
                                                <div className={styles.field}>
                                                    <span className={styles.label}>Profesión:</span>
                                                    <span className={styles.value}>
                                                        {relationship.related_character.profession || 'No especificada'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.infoSection}>
                                            <h4>
                                                <Icon
                                                    name='link'
                                                    width={16}
                                                    height={16}
                                                    alt='Relación'
                                                />
                                                Detalles de la Relación
                                            </h4>
                                            <div className={styles.fieldList}>
                                                <div className={styles.field}>
                                                    <span className={styles.label}>Tipo:</span>
                                                    <span className={styles.value}>{getRelationshipTypeLabel(relationship.relation_type)}</span>
                                                </div>
                                                <div className={styles.field}>
                                                    <span className={styles.label}>Intensidad:</span>
                                                    <span className={styles.value}>{getIntensityLabel(relationship.intensity)}</span>
                                                </div>
                                                <div className={styles.field}>
                                                    <span className={styles.label}>Estado:</span>
                                                    <span className={styles.value}>
                                                        {relationship.status === 'active' ? 'Activa' : 'Inactiva'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.descriptionSection}>
                                        <h4>Descripción de la Relación</h4>
                                        <div className={styles.descriptionContainer}>
                                            <p>
                                                {relationship.note || 'No hay una nota específica para esta relación.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <Icon
                            name='users'
                            width={48}
                            height={48}
                            alt='Sin relaciones'
                        />
                        <h3>No se encontraron relaciones</h3>
                        <p>
                            {searchTerm || filter !== 'all'
                                ? 'No hay relaciones que coincidan con los filtros aplicados.'
                                : 'Este personaje aún no tiene relaciones registradas.'
                            }
                        </p>
                        {(searchTerm || filter !== 'all') && (
                            <button 
                                className={styles.clearFiltersButton}
                                onClick={() => {
                                    setSearchTerm('')
                                    setFilter('all')
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