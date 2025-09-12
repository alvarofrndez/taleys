'use client'

import styles from '@/assets/auth/projects/universes/full-mode.module.scss'
import { useState } from 'react'
import UniverseHeader from '@/components/auth/projects/universes/UniverseHeader'
import UniverseSummary from '@/components/auth/projects/universes/UniverseSummary'
import UniverseContent from '@/components/auth/projects/universes/UniverseContent'
import Icon from '@/components/iconComponent'

export default function UniverseFullMode({ project, universe }) {
    const [active_tab, setActiveTab] = useState('summary')
    const [current_universe, setCurrentUniverse] = useState(universe)

    const tabs = [
        { id: 'summary', label: 'Resumen', icon: 'lightning' },
        { id: 'content', label: 'Contenido', icon: 'all' }
    ]

    const handleUniverseUpdate = (updated_universe) => {
        setCurrentUniverse(updated_universe)
    }

    return (
        <div className={styles.container}>
            <UniverseHeader universe={current_universe} onUniverseUpdate={handleUniverseUpdate} />
            
            <main className={styles.main}>
                <div className={styles.tabMenu}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`${styles.tabButton} ${active_tab === tab.id ? styles.active : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <Icon 
                                name={tab.icon}
                                width={16}
                                height={16}
                                alt={tab.label}
                            />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className={styles.component}>
                    {active_tab === 'summary' && <UniverseSummary project={project} universe={current_universe} />}
                    {active_tab === 'content' && <UniverseContent project={project} universe={current_universe} />}
                </div>
            </main>
        </div>
    )
}
