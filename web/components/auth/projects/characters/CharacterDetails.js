import { useState, useRef, useCallback, useEffect } from 'react'
import styles from '@/assets/auth/projects/characters/details.module.scss'
import Image from 'next/image'
import { apiCall } from '@/services/apiCall'
import { useProject } from '@/context/ProjectContext'
import Loader from '@/components/Loader'
import pushToast from '@/utils/pushToast'

export default function CharacterDetails({ character, onSave, can_edit }) {
    const { project } = useProject()
    
    const [edited_character, setEditedCharacter] = useState(character)
    const [original_character, setOriginalCharacter] = useState(character)
    const [modified_fields, setModifiedFields] = useState(new Set())
    const [editing_field, setEditingField] = useState(null)
    const [is_saving, setIsSaving] = useState(false)
    
    const field_refs = useRef({})

    const detail_sections = [
        {
            title: 'Imagen del Personaje',
            icon: '/images/icons/image.svg',
            customRender: () => {
                return (
                    <div className={styles.imageSection}>
                        <Image
                            src={edited_character.image_url ?? '/images/placeholder.svg'}
                            alt={edited_character.name || 'Personaje'}
                            width={200}
                            height={200}
                            className={styles.characterImage}
                        />
                        <button className={styles.editCharacterImage}>
                            <Image
                                src={'/images/icons/edit.svg'}
                                alt={'Cambiar imagen'}
                                width={20}
                                height={20}
                            />
                        </button>
                    </div>
                )
            }
        },
        {
            title: 'Perteneciente a',
            icon: (() => {
                switch (edited_character.belonging_level) {
                    case 'book':
                        return '/images/icons/book.svg'
                    case 'saga':
                        return '/images/icons/saga.svg'
                    case 'universe':
                        return '/images/icons/universe.svg'
                    case 'project':
                        return '/images/icons/project.svg'
                    default:
                        return '/images/icons/layers.svg'
                }
            })(),
            customRender: () => {
                const level_map = {
                    book: 'Libro',
                    saga: 'Saga',
                    universe: 'Universo',
                    project: 'Proyecto'
                }

                const obj = edited_character.belonging_object

                return (
                    <div className={styles.fieldList}>
                        <div className={styles.field}>
                            <span className={styles.label}>Nivel:</span>
                            <span className={styles.value}>
                                {level_map[edited_character.belonging_level] || 'No especificado'}
                            </span>
                        </div>

                        {obj ? (
                            <>
                                {obj.name && (
                                    <div className={styles.field}>
                                        <span className={styles.label}>Nombre:</span>
                                        <span className={styles.value}>{obj.name}</span>
                                    </div>
                                )}
                                {obj.title && (
                                    <div className={styles.field}>
                                        <span className={styles.label}>Título:</span>
                                        <span className={styles.value}>{obj.title}</span>
                                    </div>
                                )}
                                {obj.description && (
                                    <div className={styles.field}>
                                        <span className={styles.label}>Descripción:</span>
                                        <span className={styles.value}>{obj.description}</span>
                                    </div>
                                )}
                                {obj.synopsis && (
                                    <div className={styles.field}>
                                        <span className={styles.label}>Sinopsis:</span>
                                        <span className={styles.value}>{obj.synopsis}</span>
                                    </div>
                                )}
                                <div className={styles.field}>
                                    <span className={styles.label}>Creado en:</span>
                                    <span className={styles.value}>
                                        {obj.created_at || 'No disponible'}
                                    </span>
                                </div>
                                <div className={styles.field}>
                                    <span className={styles.label}>Última actualización:</span>
                                    <span className={styles.value}>
                                        {obj.updated_at || 'No disponible'}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className={styles.field}>
                                <span className={styles.value}>No hay objeto asociado</span>
                            </div>
                        )}
                    </div>
                )
            }
        },
        {
            title: 'Información Personal',
            icon: '/images/icons/user.svg',
            fields: [
                { label: 'Nombre', key: 'name', type: 'input' },
                { label: 'Alias', key: 'alias', type: 'input' },
                { label: 'Estado', key: 'status', type: 'input' },
                { label: 'Género', key: 'gender', type: 'input' },
                { label: 'Edad', key: 'age', type: 'input' },
                { label: 'Raza/Especie', key: 'race_species', type: 'input' },
                { label: 'Profesión', key: 'profession', type: 'input' }
            ]
        },
        {
            title: 'Características Físicas',
            icon: '/images/icons/show.svg',
            fields: [
                { label: 'Descripción física', key: 'physical_description', type: 'textarea', is_large: true }
            ]
        },
        {
            title: 'Personalidad y Psicología',
            icon: '/images/icons/heart.svg',
            fields: [
                { label: 'Motivaciones', key: 'motivations', type: 'textarea', is_large: true },
                { label: 'Objetivos', key: 'objectives', type: 'textarea', is_large: true },
                { label: 'Miedos', key: 'fears', type: 'textarea', is_large: true }
            ]
        },
        {
            title: 'Habilidades y Capacidades',
            icon: '/images/icons/lightning.svg',
            fields: [
                { label: 'Fortalezas', key: 'strengths', type: 'textarea', is_large: true },
                { label: 'Debilidades', key: 'weaknesses', type: 'textarea', is_large: true },
                { label: 'Habilidades', key: 'abilities', type: 'textarea', is_large: true },
                { label: 'Limitaciones', key: 'limitations', type: 'textarea', is_large: true }
            ]
        }
    ]

    const has_changes = modified_fields.size > 0

    const handleInputChange = (key, value) => {
        const original_value = original_character[key] || ''
        const normalized_value = value || ''
        
        setEditedCharacter(prev => ({
            ...prev,
            [key]: value
        }))

        setModifiedFields(prev => {
            const new_set = new Set(prev)
            if (normalized_value !== original_value) {
                new_set.add(key)
            } else {
                new_set.delete(key)
            }
            return new_set
        })
    }

    const handleFieldClick = (field_key) => {
        if (can_edit && editing_field !== field_key) {
            setEditingField(field_key)
            setTimeout(() => {
                const input = field_refs.current[field_key]
                if (input) {
                    input.focus()
                    if (input.select) input.select()
                }
            }, 0)
        }
    }

    const handleFieldBlur = (field_key) => {
        setTimeout(() => {
            if (editing_field === field_key) {
                setEditingField(null)
            }
        }, 100)
    }

    const handleKeyDown = (e, field_key) => {
        if (e.key === 'Enter' && !e.shiftKey && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault()
            setEditingField(null)
        }
        if (e.key === 'Escape') {
            setEditingField(null)
            const original_value = original_character[field_key] || ''
            setEditedCharacter(prev => ({
                ...prev,
                [field_key]: original_value
            }))
            // Quitar de campos modificados
            setModifiedFields(prev => {
                const new_set = new Set(prev)
                new_set.delete(field_key)
                return new_set
            })
        }
    }

    const handleSaveChanges = async () => {
        if (!can_edit || !has_changes) return

        setIsSaving(true)

        const response = await apiCall('PUT', `/projects/${project.id}/characters/${character.id}`, edited_character)
        
        if(response?.success){
            if (onSave) {
                onSave(response.data)
            }

            pushToast(response.message, 'success')
            setOriginalCharacter(edited_character)
            setModifiedFields(new Set())
        }

        setIsSaving(false)
    }

    const handleRevertChanges = () => {
        setEditedCharacter(original_character)
        setModifiedFields(new Set())
        setEditingField(null)
    }

    const renderFieldStatus = (field_key) => {
        if (modified_fields.has(field_key)) {
            return (
                <div className={styles.fieldStatus}>
                    <div className={styles.modifiedIndicator} />
                </div>
            )
        }
        return null
    }

    const renderField = (field) => {
        const value = edited_character[field.key] || ''
        const is_editing = editing_field === field.key
        const is_empty = !value
        const is_modified = modified_fields.has(field.key)
        
        if (field.is_large) {
            return (
                <div key={field.key} className={`${styles.largeField} ${is_modified ? styles.modified : ''}`}>
                    <div className={styles.fieldHeader}>
                        <h4>{field.label}</h4>
                        {renderFieldStatus(field.key)}
                    </div>
                    <div className={`${styles.textContainer} ${can_edit ? styles.editable : ''}`}>
                        {is_editing && can_edit ? (
                            <textarea
                                ref={el => field_refs.current[field.key] = el}
                                value={value}
                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                onBlur={() => handleFieldBlur(field.key)}
                                onKeyDown={(e) => handleKeyDown(e, field.key)}
                                className={styles.editTextarea}
                                rows={4}
                                placeholder={`Ingresa ${field.label.toLowerCase()}...`}
                                autoFocus
                            />
                        ) : (
                            <div
                                className={`${styles.textDisplay} ${can_edit ? styles.clickable : ''}`}
                                onClick={() => handleFieldClick(field.key)}
                                role={can_edit ? 'button' : 'text'}
                                tabIndex={can_edit ? 0 : -1}
                            >
                                <p className={is_empty ? styles.emptyText : ''}>
                                    {is_empty ? (
                                        can_edit ? 'Pulsar para añadir...' : 'No especificado'
                                    ) : (
                                        value
                                    )}
                                </p>
                                {can_edit && !is_empty && (
                                    <div className={styles.editHint}>
                                        <Image
                                            src='/images/icons/edit.svg'
                                            alt='Editar'
                                            width={14}
                                            height={14}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )
        }

        return (
            <div key={field.key} className={`${styles.field} ${is_modified ? styles.modified : ''}`}>
                <span className={styles.label}>{field.label}:</span>
                <div className={styles.valueWrapper}>
                    {is_editing && can_edit ? (
                        <input
                            ref={el => field_refs.current[field.key] = el}
                            type='text'
                            value={value}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                            onBlur={() => handleFieldBlur(field.key)}
                            onKeyDown={(e) => handleKeyDown(e, field.key)}
                            className={styles.editInput}
                            placeholder={`Ingresa ${field.label.toLowerCase()}...`}
                            autoFocus
                        />
                    ) : (
                        <span 
                            className={`${styles.value} ${can_edit ? styles.editableValue : ''} ${is_empty ? styles.emptyValue : ''}`}
                            onClick={() => handleFieldClick(field.key)}
                            role={can_edit ? 'button' : 'text'}
                            tabIndex={can_edit ? 0 : -1}
                        >
                            {is_empty ? (
                                can_edit ? 'Click para añadir...' : 'No especificado'
                            ) : (
                                value
                            )}
                            {can_edit && (
                                <Image
                                    src='/images/icons/edit.svg'
                                    alt='Editar'
                                    width={12}
                                    height={12}
                                    className={styles.editIcon}
                                />
                            )}
                        </span>
                    )}
                    {renderFieldStatus(field.key)}
                </div>
            </div>
        )
    }

    return (
        <main className={styles.mainContent}>
            <header className={styles.header}>
                {has_changes && can_edit && (
                    <div className={styles.changesHeader}>
                        <div className={styles.changesActions}>
                            <button 
                                onClick={handleRevertChanges}
                                className={`${styles.actionButton} ${styles.revertButton}`}
                                disabled={is_saving}
                            >
                                {is_saving ? (
                                    <Loader size={15}></Loader>
                                ) : (
                                    <>
                                        Descartar cambios
                                    </>
                                )}
                            </button>
                            <button 
                                onClick={handleSaveChanges}
                                className={`${styles.actionButton} ${styles.saveButton}`}
                                disabled={is_saving}
                            >
                                {is_saving ? (
                                    <Loader size={15} color='foreground'></Loader>
                                ) : (
                                    <>
                                        Guardar cambios
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </header>

            <div className={styles.detailsContainer}>
                {detail_sections.map((section) => (
                    <div key={section.title} className={styles.section}>
                        <header className={styles.sectionHeader}>
                            <div className={styles.titleContainer}>
                                <Image
                                    src={section.icon}
                                    alt={section.title}
                                    width={17}
                                    height={17}
                                />
                                <h3>{section.title}</h3>
                            </div>
                        </header>
                        <div className={styles.sectionContent}>
                            {section.customRender 
                                ? section.customRender() 
                                : section.fields.map(renderField)}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}