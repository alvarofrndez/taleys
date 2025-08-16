import { useEffect, useRef, useState } from 'react'
import styles from '@/assets/global/user-multiselect.module.scss'
import { useSelector } from 'react-redux'

export default function UserMultiSelect({ users = [], selected_users = [], onSelect }) {
    const [query, setQuery] = useState('')
    const [filtered_users, setFilteredUsers] = useState([])
    const [show_dropdown, setShowDropdown] = useState(false)
    const me = useSelector((state) => state.auth.user)

    const wrapper_ref = useRef(null)

    useEffect(() => {
        const lower = query.toLowerCase()
        setFilteredUsers(
            users.filter(u =>
                u.name.toLowerCase().includes(lower) ||
                u.email.toLowerCase().includes(lower)
            ).slice(0, 10)
        )
        setShowDropdown(!!lower)
    }, [query, users])

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapper_ref.current && !wrapper_ref.current.contains(event.target)) {
                setShowDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleAdd = (user) => {
        if (!selected_users.find(u => u.id === user.id)) {
            const updated = [...selected_users, user]
            onSelect(updated)
        }
        setQuery('')
        setShowDropdown(false)
    }

    return (
        <div ref={wrapper_ref} className={styles.wrapper}>
            <div className={styles.selected}>
                <input
                    type='text'
                    placeholder='Buscar usuario...'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (query.length > 0) setShowDropdown(true)
                    }}
                />
            </div>

            {show_dropdown && filtered_users.length > 0 && (
                <ul className={styles.dropdown}>
                    {filtered_users.map(user => (
                        user.id !== me.id && 
                        <li key={user.id} onClick={() => handleAdd(user)}>
                            {user.name} <span>({user.email})</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
