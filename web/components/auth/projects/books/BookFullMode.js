'use client'

import styles from '@/assets/auth/projects/books/full-mode.module.scss'
import { useState } from 'react'
import BookHeader from '@/components/auth/projects/books/BookHeader'
import BookSummary from '@/components/auth/projects/books/BookSummary'
import BookContent from '@/components/auth/projects/books/BookContent'
import Icon from '@/components/iconComponent'

export default function BookFullMode({ project, book }) {
    const [active_tab, setActiveTab] = useState('summary')
    const [current_book, setCurrentBook] = useState(book)

    const tabs = [
        { id: 'summary', label: 'Resumen', icon: 'lightning' },
        { id: 'content', label: 'Contenido', icon: 'all' }
    ]

    const handleBookUpdate = (updated_book) => {
        setCurrentBook(updated_book)
    }

    return (
        <div className={styles.container}>
            <BookHeader book={current_book} onBookUpdate={handleBookUpdate} />
            
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
                    {active_tab === 'summary' && <BookSummary project={project} book={current_book} />}
                    {active_tab === 'content' && <BookContent project={project} book={current_book} />}
                </div>
            </main>
        </div>
    )
}
