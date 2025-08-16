'use client'

import styles from '@/assets/auth/project-search.module.scss'
import { useState } from 'react'
import Image from 'next/image'

const ProjectSearch = () => {
    const [search, setSearch] = useState('')

    return (
        <div className={styles.projectSearch}>
            <Image className={styles.searchIcon} src={'/images/icons/search.svg'} alt='search' width={20} height={20} />
            <input type="text" placeholder="Buscar proyecto" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
    )
}

export default ProjectSearch