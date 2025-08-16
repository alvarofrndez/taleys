'use client'

import styles from '@/assets/auth/projects/content.module.scss'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'

export default function ProjectContent({ project }) {
    const router = useRouter()
    const user = useSelector((state) => state.auth.user)

    const goToUniverse = (universe_name) => {
        router.push(`/${user.username}/projects/${project.name}/universes/${universe_name}`)
    }

    return (
        <section className={styles.content}>
            {
                project.universes?.map((universe) => {
                    return (
                        <div key={universe.id} onClick={() => goToUniverse(universe.name)}>
                            <header></header>
                            <div>
                                <div>
                                    <h4>{universe.name}</h4>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </section>
    )
}