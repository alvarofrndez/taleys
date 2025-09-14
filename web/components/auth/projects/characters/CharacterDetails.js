import { useState, useRef, useCallback, useEffect } from 'react'
import styles from '@/assets/auth/projects/characters/details.module.scss'
import Image from 'next/image'
import { apiCall } from '@/services/apiCall'
import { useProject } from '@/context/ProjectContext'
import Loader from '@/components/Loader'
import pushToast from '@/utils/pushToast'
import Icon from '@/components/iconComponent'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

export default function CharacterDetails({ character, onSave, can_edit }) {
    const { project } = useProject()
    const router = useRouter()
    const user = useSelector((state) => state.auth.user)
    
    const [edited_character, setEditedCharacter] = useState({
        ...character,
        extra_attributes: character.extra_attributes || []
    })
    const [original_character, setOriginalCharacter] = useState({
        ...character,
        extra_attributes: character.extra_attributes || []
    })
    const [modified_fields, setModifiedFields] = useState(new Set())
    const [editing_field, setEditingField] = useState(null)
    const [is_saving, setIsSaving] = useState(false)
    
    const field_refs = useRef({})

    const detail_sections = [
        {
            title: 'Imagen del Personaje',
            icon: 'image',
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
                            <Icon
                                name='edit'
                                width={17}
                                height={17}
                                alt='Cambiar imagen'
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
                        return 'book'
                    case 'saga':
                        return 'saga'
                    case 'universe':
                        return 'internet'
                    case 'project':
                        return 'project'
                    default:
                        return 'layers'
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
                    <div className={styles.fieldList} onClick={() => gotToBelonging(edited_character.belonging_level, obj)}>
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
            icon: 'user',
            fields: [
                { label: 'Nombre', key: 'name', type: 'input' },
                { label: 'Alias', key: 'alias', type: 'input' }
            ],
            customHeader: () => {
                return can_edit && (
                    <div className={styles.customHeader}>
                        <button
                            type='button'
                            className={styles.addButton}
                            onClick={handleAddExtra}
                        >
                            <Icon name='add' width={14} height={14} alt='Añadir' /> 
                            Añadir atributo
                        </button>
                    </div>
                )
            },
            customRender: () => {
                return (
                    <>
                        {renderField({ label: 'Nombre', key: 'name', type: 'input' })}
                        {renderField({ label: 'Alias', key: 'alias', type: 'input' })}
                        
                        {edited_character.extra_attributes.map((attr, index) => 
                            renderExtraAttribute(attr, index)
                        )}
                    </>
                )
            }
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

   const handleExtraChange = (index, field, value) => {
        const new_attributes = [...edited_character.extra_attributes]
        new_attributes[index] = {
            ...new_attributes[index],
            [field]: value
        }
        setEditedCharacter(prev => ({
            ...prev,
            extra_attributes: new_attributes
        }))
        setModifiedFields(prev => new Set(prev).add('extra_attributes'))
    }

    const handleAddExtra = () => {
        const new_attributes = [...edited_character.extra_attributes, { key: '', value: '' }]
        setEditedCharacter(prev => ({
            ...prev,
            extra_attributes: new_attributes
        }))
        
        setModifiedFields(prev => new Set(prev).add('extra_attributes'))
    }

    const handleRemoveExtra = (index) => {
        const new_attributes = edited_character.extra_attributes.filter((_, i) => i !== index)
        setEditedCharacter(prev => ({
            ...prev,
            extra_attributes: new_attributes
        }))
        setModifiedFields(prev => new Set(prev).add('extra_attributes'))
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
            
            if (field_key.startsWith('extra_')) {
                setEditedCharacter(prev => ({
                    ...prev,
                    extra_attributes: original_character.extra_attributes
                }))
                setModifiedFields(prev => {
                    const new_set = new Set(prev)
                    new_set.delete('extra_attributes')
                    return new_set
                })
            } else {
                const original_value = original_character[field_key] || ''
                setEditedCharacter(prev => ({
                    ...prev,
                    [field_key]: original_value
                }))
                setModifiedFields(prev => {
                    const new_set = new Set(prev)
                    new_set.delete(field_key)
                    return new_set
                })
            }
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

    const gotToBelonging = (level, belonging) => {
        let partial_url = ``

        switch(level){
            case 'universe': {
                partial_url += `/universes/${belonging.slug}`
             
                break
            }
            case 'saga': {
                if(belonging.universe){
                    partial_url += `/universes/${belonging.universe.slug}/sagas/${belonging.slug}`
                }else{
                    partial_url += `/sagas/${belonging.slug}`
                }

                break
            }
            case 'book': {
                if(belonging.universe && belonging.saga){
                    partial_url += `/universes/${belonging.universe.slug}/sagas/${belonging.saga.slug}/books/${belonging.slug}`
                }else if(belonging.universe && !belonging.saga){
                    partial_url += `/universes/${belonging.universe.slug}/books/${belonging.slug}`
                }else if(!belonging.universe && belonging.saga){
                    partial_url += `/sagas/${belonging.saga.slug}/books/${belonging.slug}`
                }else{
                    partial_url += `/books/${belonging.slug}`
                }

                break
            }
            default:{
                break
            }
        }

        router.push(`/${user.username}/projects/${project.slug}${partial_url}`)
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
                        </span>
                    )}
                    {renderFieldStatus(field.key)}
                </div>
            </div>
        )
    }

    const renderExtraAttribute = (attr, index) => {
        const is_key_editing = editing_field === `extra_key_${index}`
        const is_value_editing = editing_field === `extra_value_${index}`
        const is_empty_key = !attr.key
        const is_empty_value = !attr.value

        return (
            <div key={`extra_${index}`} className={styles.field}>
                <div className={styles.labelExtra}>
                    {is_key_editing && can_edit ? (
                        <input
                            ref={el => field_refs.current[`extra_key_${index}`] = el}
                            type='text'
                            value={attr.key}
                            onChange={(e) => handleExtraChange(index, 'key', e.target.value)}
                            onBlur={() => handleFieldBlur(`extra_key_${index}`)}
                            onKeyDown={(e) => handleKeyDown(e, `extra_key_${index}`)}
                            className={styles.editInput}
                            placeholder='Nombre del atributo...'
                            autoFocus
                        />
                    ) : (
                        <span 
                            className={`${styles.value} ${can_edit ? styles.editableValue : ''} ${is_empty_key ? styles.emptyValue : ''}`}
                            onClick={() => handleFieldClick(`extra_key_${index}`)}
                            role={can_edit ? 'button' : 'text'}
                            tabIndex={can_edit ? 0 : -1}
                        >
                            {is_empty_key ? (
                                can_edit ? 'Click para añadir clave...' : 'No especificado'
                            ) : (
                                attr.key
                            )}
                        </span>
                    )}
                </div>
                <div className={styles.valueWrapper}>
                    {is_value_editing && can_edit ? (
                        <input
                            ref={el => field_refs.current[`extra_value_${index}`] = el}
                            type='text'
                            value={attr.value}
                            onChange={(e) => handleExtraChange(index, 'value', e.target.value)}
                            onBlur={() => handleFieldBlur(`extra_value_${index}`)}
                            onKeyDown={(e) => handleKeyDown(e, `extra_value_${index}`)}
                            className={styles.editInput}
                            placeholder='Valor del atributo...'
                            autoFocus
                        />
                    ) : (
                        <span 
                            className={`${styles.value} ${can_edit ? styles.editableValue : ''} ${is_empty_value ? styles.emptyValue : ''}`}
                            onClick={() => handleFieldClick(`extra_value_${index}`)}
                            role={can_edit ? 'button' : 'text'}
                            tabIndex={can_edit ? 0 : -1}
                        >
                            {is_empty_value ? (
                                can_edit ? 'Click para añadir valor...' : 'No especificado'
                            ) : (
                                attr.value
                            )}
                        </span>
                    )}
                </div>
                {can_edit && (
                    <Icon
                        name='cross'
                        width={12}
                        height={12}
                        alt='Eliminar'
                        color='var(--color-danger)'
                        className={styles.deleteIcon}
                        onClick={() => handleRemoveExtra(index)}
                    />
                )}
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
                                <Icon
                                    name={section.icon}
                                    width={17}
                                    height={17}
                                    alt={section.title}
                                />
                                <h3>{section.title}</h3>
                            </div>
                            {section.customHeader
                                ? section.customHeader()
                                : null
                            }
                        </header>
                        <div className={styles.sectionContent}>
                            {section.customRender 
                                ? section.customRender() 
                                : section.fields?.map(renderField)}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}