'use client'

import styles from '@/assets/auth/projects/summary.module.scss'
import { useSelector } from 'react-redux'
import { apiCall } from '@/services/apiCall'
import pushToast from '@/utils/pushToast'
import ProjectFastActions from '@/components/auth/projects/ProjectFastActions'
import Icon from '@/components/iconComponent'
import { canModify } from '@/utils/projects/canModify'

export default function ProjectSummary({ project }) {
    const user = useSelector((state) => state.auth.user)

    return (
        <section className={styles.summary}>
            {canModify(project, user) &&
                <div className={styles.fastActions}>
                    <header>
                        <div className={styles.title}>
                            <Icon
                                name='lightning'
                                alt='rayo'
                                width={20}
                                height={20}
                            />
                            <h2>Acciones Rápidas</h2>
                        </div>
                        <span className={styles.subtitle}>Crea nuevo contenido para tu proyecto</span>
                    </header>
                    <ProjectFastActions project={project}/>
                </div>
            }
        </section>
    )
}