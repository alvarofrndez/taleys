import styles from '@/assets/auth/projects/characters/relationships.module.scss'
import { useState, useEffect } from 'react'
import { apiCall } from '@/services/apiCall'
import Loader from '@/components/Loader'
import { openModal } from '@/stores/modalSlice'
import { useDispatch } from 'react-redux'
import Icon from '@/components/iconComponent'

export default function CharacterRelationships({ character, project, can_edit }) {
    const dispatch = useDispatch()
    const [relationships, setRelationships] = useState(null)
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        const fetchRelationships = async () => {
            const response = await apiCall('GET', `/projects/${project.id}/characters/${character.id}/relationships`)
            if (response.success) {
                setRelationships(response.data || [])
            } else {
                setRelationships([])
            }
            setLoading(false)
        }

        fetchRelationships()
    }, [project.id, character.id])

    const fetchRelationships = async () => {
        const response = await apiCall('GET', `/projects/${project.id}/characters/${character.id}/relationships`)
        if (response.success) {
            setRelationships(response.data || [])
        } else {
            setRelationships([])
        }
        setLoading(false)
    }

    const getFilteredRelationships = () => {
        if (filter === 'all') return relationships
        return relationships.filter(relationship => relationship.relation_type === filter)
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

    const openNewCharacter = () => {
        dispatch(openModal({
            component: 'CreateCharacterRelationship',
            props: { project, character, onClose: fetchRelationships },
        }))
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
    const relationshipStats = {
        total: relationships.length,
        allies: relationships.filter(r => r.relation_type === 'ally').length,
        enemies: relationships.filter(r => r.relation_type === 'enemy').length,
        family: relationships.filter(r => r.relation_type === 'family').length
    }

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
                                onClick={() => openNewCharacter()}
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
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className={styles.filterSection}>
                    <div className={styles.filterButtons}>
                        {['all','ally','enemy','family','romantic'].map(type => (
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
                        {
                            filteredRelationships.map((relationship) => (
                                <div key={relationship.id} className={styles.relationshipCard}>
                                    <header className={styles.relationshipHeader}>
                                        <div className={styles.characterInfo}>
                                            <div className={styles.characterAvatar}>
                                                {relationship.related_character.name}
                                            </div>
                                            <div className={styles.characterDetails}>
                                                <h3>{relationship.related_character.name}</h3>
                                                <p>{relationship.related_character.role}</p>
                                            </div>
                                        </div>
                                        <div className={styles.badges}>
                                            <span className={styles.typeBadge}>
                                                <Icon
                                                    name={(getRelationshipIcon(relationship.relation_type))}
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
                                                        <span className={styles.label}>Rol:</span>
                                                        <span className={styles.value}>{relationship.related_character.role}</span>
                                                    </div>
                                                    <div className={styles.field}>
                                                        <span className={styles.label}>Profesión:</span>
                                                        <span className={styles.value}>{relationship.related_character.profession}</span>
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
                            ))
                        }    
                    </div>
                )
                : (
                    <div className={styles.emptyState}>
                        <Icon
                            name='users'
                            width={48}
                            height={48}
                            alt='Sin relaciones'
                        />
                        <h3>No se encontraron relaciones</h3>
                        <p>
                            {filter === 'all' 
                                ? 'Este personaje aún no tiene relaciones registradas.'
                                : `No hay relaciones de tipo '${getRelationshipTypeLabel(filter)}'.`
                            }
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}
