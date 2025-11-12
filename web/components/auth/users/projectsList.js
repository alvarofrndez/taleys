'use client'

import styles from '@/assets/auth/users/projects-list.module.scss'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProjectCard from '@/components/auth/projects/ProjectCard'

export default function UserProjectsList({ projects = [] }) {
    const [filteredProjects, setFilteredProjects] = useState(projects)
    const [filter, setFilter] = useState('all')
    const router = useRouter()
    const filters = [
        { label: 'Todos', value: 'all' },
        { label: 'Recientes', value: 'recent' },
        { label: 'Populares', value: 'popular' },
        { label: 'Destacados', value: 'pined' }
    ]
    
    useEffect(() => {
        switch (filter) {
            case 'recent':
                setFilteredProjects([...projects].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
                break
            case 'popular':
                setFilteredProjects([...projects].sort((a, b) => b.likes_count - a.likes_count))
                break
            case 'pined':
                setFilteredProjects(projects.filter(project => project.is_pined))
                break
            default:
                setFilteredProjects(projects)
        }
    }, [filter, projects])

    return (
        <div className={styles.container}>
            <header>
                <nav className={styles.projectsMenu}>
                    {filters.map(({ label, value }) => (
                        <li
                            key={value}
                            className={filter === value ? styles.active : ''}
                            onClick={() => setFilter(value)}
                        >
                            {label}
                        </li>
                    ))}
                </nav>
            </header>

            <div className={styles.body}>
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                        <>
                            <ProjectCard project_param={project} key={project.id}/>
                            <ProjectCard project_param={project} key={project.id}/>
                        </>
                    ))
                ) : (
                    <h3 className={styles.bodyNoProjects}>No hay proyectos para mostrar.</h3>
                )}
            </div>
        </div>
    )
}