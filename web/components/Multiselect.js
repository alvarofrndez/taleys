import styles from '@/assets/global/multiselect.module.scss'
import React, { useState, useRef, useEffect } from 'react'
import Icon from '@/components/iconComponent'

export default function MultiSelect({
  items = [],
  selected_items = [],
  onChange = () => {},
  display_property = 'name',
  value_property = 'id',
  placeholder = 'Selecciona elementos...',
  searchable = true,
  disabled = false,
  className = '',
  show_select_all = true,
  custom_renderer = null,
  filterFunction = null,
  empty_message = 'No hay elementos disponibles'
}) {
    const [is_open, setIsOpen] = useState(false)
    const [search_term, setSearchTerm] = useState('')
    const container_ref = useRef(null)
    const search_input_ref = useRef(null)

    const filtered_iems = searchable && search_term
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

    const isSelected = (item) => {
        const item_value = getItemValue(item)
        return selected_items.some(selected => getItemValue(selected) === item_value)
    }

    const handleItemToggle = (item) => {
        const item_value = getItemValue(item)
        const is_currently_selected = isSelected(item)

        let new_selection
        if (is_currently_selected) {
            new_selection = selected_items.filter(selected => getItemValue(selected) !== item_value)
        } else {
            new_selection = [...selected_items, item]
        }

        onChange(new_selection)
    }

    const handleSelectAll = () => {
        const allSelected = filtered_iems.length > 0 && 
        filtered_iems.every(item => isSelected(item))
        
        if (allSelected) {
            const filteredValues = filtered_iems.map(getItemValue)
            const new_selection = selected_items.filter(selected => !filteredValues.includes(getItemValue(selected)))
            onChange(new_selection)
        } else {
            const toAdd = filtered_iems.filter(item => !isSelected(item))
            onChange([...selected_items, ...toAdd])
        }
    }

    const removeSelected = (itemToRemove, e) => {
        e.stopPropagation()
        const new_selection = selected_items.filter(selected => 
            getItemValue(selected) !== getItemValue(itemToRemove)
        )
        onChange(new_selection)
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

    const all_filtered_selected = filtered_iems.length > 0 && 
        filtered_iems.every(item => isSelected(item))

  return (
    <div ref={container_ref} className={`${styles.multiselectContainer} ${disabled ? styles.disabled : ''} ${className}`}>
        <div className={styles.multiselectInput} onClick={() => !disabled && setIsOpen(!is_open)}>
            {selected_items.map((item) => (
                <span key={getItemValue(item)} className={styles.selectedTag}>
                    {getItemDisplay(item)}
                    {!disabled && (
                        <Icon
                            name='cross'
                            alt='Quitar'
                            width={12}
                            height={12}
                            onClick={(e) => removeSelected(item, e)}
                        />
                    )}
                </span>
            ))}

            {selected_items.length === 0 && (
                <span className={styles.placeholder}>{placeholder}</span>
            )}

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

        {is_open && (
            <div className={styles.multiselectDropdown}>
                {searchable && (
                    <div className={styles.searchBox}>
                        <input
                            ref={search_input_ref}
                            type='text'
                            placeholder='Buscar...'
                            value={search_term}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}

                {show_select_all && filtered_iems.length > 0 && (
                    <div className={`${styles.selectAll} ${all_filtered_selected ? styles.active : '' }`} onClick={handleSelectAll}>
                        <input type='checkbox' checked={all_filtered_selected} readOnly />
                        {all_filtered_selected ? 'Deseleccionar todos' : 'Seleccionar todos'}
                    </div>
                )}

                <div className={styles.itemsList}>
                    {filtered_iems.length === 0 ? (
                        <div className={styles.empty}>
                            {search_term
                            ? `No se encontraron resultados para '${search_term}'`
                            : empty_message
                            }
                        </div>
                        ) : (
                        filtered_iems.map((item) => {
                            const selected = isSelected(item)
                                return (
                                <div
                                    key={getItemValue(item)}
                                    className={`${styles.item} ${
                                    selected ? styles.selected : ''
                                    }`}
                                    onClick={() => handleItemToggle(item)}
                                >
                                    <input type='checkbox' checked={selected} readOnly />
                                    {getItemDisplay(item)}
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