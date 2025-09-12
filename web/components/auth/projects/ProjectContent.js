'use client'

import styles from '@/assets/auth/projects/content.module.scss'
import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'

import UniverseCard from '@/components/auth/projects/universes/UniverseCard'
import SagaCard from '@/components/auth/projects/sagas/SagaCard'
import BookCard from '@/components/auth/projects/books/BookCard'
import CharacterCard from '@/components/auth/projects/characters/CharacterCard'
import Icon from '@/components/iconComponent'

export default function ProjectContent({ project }) {
    const [search_term, setSearchTerm] = useState('')
    const [active_filters, setActiveFilters] = useState([])
    const [view_mode, setViewMode] = useState('grid')

    const router = useRouter()
    const user = useSelector((state) => state.auth.user)

    const icons = {
        all: 'all',
        universe: 'internet',
        saga: 'saga',
        book: 'book',
        character: 'character',
        event: 'calendar',
        place: 'place',
        search: 'search',
        grid: 'all',
        list: 'list',
        empty: 'empty',
    }

    const filter_options = [
        { value: 'universe', label: 'Universos', icon: icons.universe },
        { value: 'saga', label: 'Sagas', icon: icons.saga },
        { value: 'book', label: 'Libros', icon: icons.book },
        { value: 'character', label: 'Personajes', icon: icons.character },
        { value: 'event', label: 'Eventos', icon: icons.event },
        { value: 'place', label: 'Lugares', icon: icons.place },
    ]

    const getAllItems = () => {
        const all_items = [
            ...(project.universes || []).map(u => ({ ...u, type: 'universe', name: u.name, description: u.description || '' })),
            ...(project.sagas || []).map(s => ({ ...s, type: 'saga', name: s.name, description: s.description || '' })),
            ...(project.books || []).map(b => ({ ...b, type: 'book', name: b.title, description: b.description || '' })),
            ...(project.characters || []).map(c => ({ ...c, type: 'character', name: c.name, description: c.biography || '' })),
        ]

        return all_items.filter((item) => {
            const matches_search =
                item.name.toLowerCase().includes(search_term.toLowerCase()) ||
                (item.description || '').toLowerCase().includes(search_term.toLowerCase())
            
            // ahora matches_filter revisa si el item.type está en el array active_filters
            const matches_filter = active_filters.length === 0 || active_filters.includes(item.type)
            return matches_search && matches_filter
        })
    }

    const filtered_items = useMemo(() => getAllItems(), [project, search_term, active_filters])

    const toggleFilter = (filterValue) => {
        if (active_filters.includes(filterValue)) {
            // quitar del array
            setActiveFilters(active_filters.filter(f => f !== filterValue))
        } else {
            // agregar al array
            setActiveFilters([...active_filters, filterValue])
        }
    }

    const renderCard = (item) => {
        switch (item.type) {
            case 'universe':
                return <UniverseCard key={`${item.id}-${item.slug}`} project={project} universe={item} />
            case 'saga':
                return <SagaCard key={`${item.id}-${item.slug}`} project={project} saga={item} />
            case 'book':
                return <BookCard key={`${item.id}-${item.slug}`} project={project} book={item} />
            case 'character':
                return <CharacterCard key={`${item.id}-${item.slug}`} project={project} character={item} />
        }
    }

    return (
        <div className={styles.container}>
            <header className={styles.toolbar}>
                <div className={styles.searchContainer}>
                    <Icon 
                        name={icons.search}
                        width={15}
                        height={15}
                        alt='Buscar'
                        className={styles.searchIcon}
                    />
                    <input
                        type='text'
                        placeholder='Buscar en universes, sagas o books...'
                        value={search_term}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.filters}>
                    {filter_options.map((filter) => (
                        <button
                            key={filter.value}
                            className={`${styles.filterBtn} ${active_filters.includes(filter.value) ? styles.active : ''}`}
                            onClick={() => toggleFilter(filter.value)}
                        >
                            <Icon 
                                name={filter.icon}
                                width={14}
                                height={14}
                                color={active_filters.includes(filter.value) ? 'var(--color-active-foreground)' : undefined}
                                alt={filter.label}
                                className={styles.icon}
                            />
                            {filter.label}
                        </button>
                    ))}
                </div>
            </header>

            <section className={styles.content}>
                <div className={styles.contentHeader}>
                    <h2>
                        {active_filters.length === 0
                            ? 'Todo el contenido'
                            : `Filtrando: ${active_filters.map(f => filter_options.find(opt => opt.value === f)?.label).join(', ')}`}
                    </h2>
                    <div className={styles.elements}>
                        <span className={styles.badge}>{filtered_items.length} elemento{filtered_items.length == 1 ? '' : 's'}</span>
                        <button onClick={() => setViewMode(view_mode === 'grid' ? 'list' : 'grid')} className={styles.iconLayout}>
                            <Icon 
                                name={view_mode === 'grid' ? icons.list : icons.grid}
                                width={14}
                                height={14}
                                alt='Vista'
                                className={styles.icon}
                            />
                        </button>
                    </div>
                </div>

                {filtered_items.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Icon 
                            name={'empty'}
                            width={32}
                            height={32}
                            alt='Vacío'
                            className={styles.icon}
                            color='var(--color-muted-foreground)'
                        />
                        <p>No se encontraron elementos</p>
                    </div>
                ) : (
                    <div className={view_mode === 'grid' ? styles.gridView : styles.listView}>
                        {filtered_items.map(renderCard)}
                    </div>
                )}
            </section>
        </div>
    )
}
