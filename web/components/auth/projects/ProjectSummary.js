'use client'

import styles from '@/assets/auth/projects/summary.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { apiCall } from '@/services/apiCall'
import { apiShare } from '@/services/apiShare'
import { time } from '@/services/time'
import { openModal } from '@/stores/modalSlice'
import Image from 'next/image'
import { useState } from 'react'
import LoaderComponent from '@/components/Loader'
import pushToast from '@/utils/pushToast'
import ProjectFastActions from '@/components/auth/projects/ProjectFastActions'

export default function ProjectSummary({ project }) {
    return (
        <section className={styles.summary}>
            <div className={styles.fastActions}>
                <header>
                    <div className={styles.title}>
                        <Image src={'/images/icons/lightning.svg'} width={20} height={20} alt='rayo'/>
                        <h2>Acciones Rápidas</h2>
                    </div>
                    <span className={styles.subtitle}>Crea nuevo contenido para tu proyecto</span>
                </header>
                <ProjectFastActions project={project}/>
            </div>
        </section>
    )
}