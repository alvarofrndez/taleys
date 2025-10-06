'use client'

import * as RadixDropdown from '@radix-ui/react-dropdown-menu'
import Icon from '@/components/iconComponent'
import styles from '@/assets/global/dropdown-menu.module.scss'

export default function DropdownMenu({
    options,
    triggerIcon = 'more-horizontal',
    triggerIconSize = 18,
    triggerContent = null,
    ariaLabel = 'Opciones de menú',
    triggerClassName,
    menuClassName,
    align = 'end'
}) {
    return (
        <RadixDropdown.Root >
            <RadixDropdown.Trigger asChild>
                <button
                    className={`${styles.dropdownTrigger} ${triggerClassName || ''}`}
                    aria-label={ariaLabel}
                >
                    {triggerContent ? (
                        triggerContent
                    ) : (
                        <Icon
                            name={triggerIcon}
                            width={triggerIconSize}
                            height={triggerIconSize}
                            alt='menu'
                        />
                    )}
                </button>
            </RadixDropdown.Trigger>

            <RadixDropdown.Portal>
                <RadixDropdown.Content
                    className={`${styles.dropdownMenu} ${menuClassName || ''}`}
                    align={align}
                >
                {options.map((option, idx) =>
                    option.divider ? (
                        <RadixDropdown.Separator
                            key={`sep-${idx}`}
                            className={styles.dropdownSeparator}
                        />
                    ) : (
                        <RadixDropdown.Item
                            key={option.id || idx}
                            className={`${styles.dropdownItem} ${option.dangerous ? styles.dangerous : ''}`}
                            disabled={option.disabled}
                            onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                option.onClick?.()
                            }}
                        >
                            {option.icon && (
                                <Icon
                                    name={option.icon}
                                    width={14}
                                    height={14}
                                    alt={option.label || 'icono'}
                                    className={styles.itemIcon}
                                />
                            )}
                            <span className={styles.itemLabel}>{option.label}</span>
                            {option.shortcut && (<span className={styles.shortcut}>{option.shortcut}</span>)}
                        </RadixDropdown.Item>
                    )
                )}
                </RadixDropdown.Content>
            </RadixDropdown.Portal>
        </RadixDropdown.Root>
    )
}