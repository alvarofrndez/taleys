'use client'

import styles from '@/assets/auth/project-search.module.scss'
import { useState } from 'react'
import Icon from './iconComponent'

const ProjectSearch = () => {
    const [search, setSearch] = useState('')

    return (
        <div className={styles.projectSearch}>
            <Icon
                name='search'
                alt='buscar'
                width={20}
                height={20}
                className={styles.searchIcon}
                onClick={() => dispatch(closeModal())}
            />
            <input type="text" placeholder="Buscar proyecto" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
    )
}

export default ProjectSearch