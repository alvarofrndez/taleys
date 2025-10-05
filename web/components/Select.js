import styles from '@/assets/global/select.module.scss'
import React, { useState, useRef, useEffect } from 'react'
import Icon from '@/components/iconComponent'

export default function Select({
  items = [],
  selected_item = null,
  onChange = () => {},
  display_property = 'name',
  value_property = 'id',
  placeholder = 'Selecciona una opción...',
  searchable = true,
  disabled = false,
  className = '',
  custom_renderer = null,
  filterFunction = null,
  empty_message = 'No hay elementos disponibles',
  disabled_property = null,
  allow_clear = true,
}) {
    const [is_open, setIsOpen] = useState(false)
    const [search_term, setSearchTerm] = useState('')
    const container_ref = useRef(null)
    const search_input_ref = useRef(null)

    const filtered_items = searchable && search_term
        ? items.filter(item => {
            if (filterFunction) {
                return filterFunction(item, search_term)
            }
            const displayValue = typeof item === 'object' ? item[display_property] : item
            return displayValue?.toString().toLowerCase().includes(search_term.toLowerCase())
        })
        : items

    const getItemValue = (item) => {
        return typeof item === 'object' ? item[value_property] : item
    }

    const getItemDisplay = (item) => {
        if (custom_renderer) return custom_renderer(item)
        return typeof item === 'object' ? item[display_property] : item
    }

    const isItemDisabled = (item) => {
        if (!disabled_property) return false
        return typeof item === 'object' ? item[disabled_property] === true : false
    }

    const isSelected = (item) => {
        if (!selected_item) return false
        const item_value = getItemValue(item)
        const selected_value = getItemValue(selected_item)
        return item_value === selected_value
    }

    const handleItemSelect = (item) => {
        onChange(item)
        setIsOpen(false)
        setSearchTerm('')
    }

    const handleClear = (e) => {
        e.stopPropagation()
        onChange(null)
    }

    const handleToggleDropdown = () => {
        if (disabled) return
        setIsOpen(!is_open)
        if (!is_open) {
            setSearchTerm('')
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (container_ref.current && !container_ref.current.contains(event.target)) {
                setIsOpen(false)
                setSearchTerm('')
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (is_open && searchable && search_input_ref.current) {
            search_input_ref.current.focus()
        }
    }, [is_open, searchable])

    const handleKeyDown = (e) => {
        if (disabled) return
        
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleToggleDropdown()
        } else if (e.key === 'Escape' && is_open) {
            setIsOpen(false)
            setSearchTerm('')
        }
    }

    return (
        <div 
            ref={container_ref} 
            className={`${styles.selectContainer} ${disabled ? styles.disabled : ''} ${className}`}
            onKeyDown={handleKeyDown}
            tabIndex={disabled ? -1 : 0}
        >
            <div className={styles.selectInput} onClick={handleToggleDropdown}>
                {selected_item ? (
                    <div className={styles.selectedItem}>
                        <span className={styles.selectedValue}>
                            {getItemDisplay(selected_item)}
                        </span>

                        {allow_clear && selected_item && !disabled && (
                            <Icon
                                name="cross"
                                alt="Limpiar selección"
                                width={12}
                                height={12}
                                onClick={handleClear}
                                className={styles.clearIcon}
                            />
                        )}
                    </div>
                ) : (
                    <span className={styles.placeholder}>{placeholder}</span>
                )}
                
                <div className={styles.selectActions}>
                    <div className={styles.arrow}>
                        {is_open ? 
                            <Icon
                                name='arrow-up'
                                alt='Cerrar'
                                width={12}
                                height={12}
                            />
                        : 
                            <Icon
                                name='arrow-down'
                                alt='Abrir'
                                width={12}
                                height={12}
                            />
                        }
                    </div>
                </div>
            </div>

            {is_open && (
                <div className={styles.selectDropdown}>
                    {searchable && (
                        <div className={styles.searchBox}>
                            <input
                                ref={search_input_ref}
                                type='text'
                                placeholder='Buscar...'
                                value={search_term}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}

                    <div className={styles.itemsList}>
                        {filtered_items.length === 0 ? (
                            <div className={styles.empty}>
                                {search_term
                                    ? `No se encontraron resultados para '${search_term}'`
                                    : empty_message
                                }
                            </div>
                        ) : (
                            filtered_items.map((item) => {
                                const selected = isSelected(item)
                                const item_disabled = isItemDisabled(item)
                                
                                return (
                                    <div
                                        key={getItemValue(item)}
                                        className={`${styles.item} ${selected ? styles.selected : ''} ${item_disabled ? styles.disabled : ''}`}
                                        onClick={() => !item_disabled && handleItemSelect(item)}
                                    >
                                        {getItemDisplay(item)}
                                        {selected && (
                                            <Icon
                                                name="check"
                                                alt="Seleccionado"
                                                width={14}
                                                height={14}
                                                className={styles.checkIcon}
                                            />
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}