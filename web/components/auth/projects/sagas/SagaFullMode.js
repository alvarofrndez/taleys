'use client'

import styles from '@/assets/auth/projects/sagas/full-mode.module.scss'
import { useState } from 'react'
import SagaHeader from '@/components/auth/projects/sagas/SagaHeader'
import SagaSummary from '@/components/auth/projects/sagas/SagaSummary'
import SagaContent from '@/components/auth/projects/sagas/SagaContent'
import Icon from '@/components/iconComponent'

export default function SagaFullMode({ project, saga }) {
    const [active_tab, setActiveTab] = useState('summary')
    const [current_saga, setCurrentSaga] = useState(saga)

    const tabs = [
        { id: 'summary', label: 'Resumen', icon: 'lightning' },
        { id: 'content', label: 'Contenido', icon: 'all' }
    ]

    const handleSagaUpdate = (updated_saga) => {
        setCurrentSaga(updated_saga)
    }

    return (
        <div className={styles.container}>
            <SagaHeader saga={current_saga} onSagaUpdate={handleSagaUpdate} />
            
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
                    {active_tab === 'summary' && <SagaSummary project={project} saga={current_saga} />}
                    {active_tab === 'content' && <SagaContent project={project} saga={current_saga} />}
                </div>
            </main>
        </div>
    )
}
