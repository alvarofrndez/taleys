'use client'

import styles from '@/assets/auth/projects/universes/summary.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { apiCall } from '@/services/apiCall'
import { apiShare } from '@/services/apiShare'
import { time } from '@/services/time'
import { openModal } from '@/stores/modalSlice'
import Image from 'next/image'
import { useState } from 'react'
import LoaderComponent from '@/components/Loader'
import pushToast from '@/utils/pushToast'
import UniverseFastActions from '@/components/auth/projects/universes/UniverseFastActions'
import Icon from '@/components/iconComponent'

export default function UniverseSummary({ project, universe }) {
    return (
        <section className={styles.summary}>
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
                    <span className={styles.subtitle}>Crea nuevo contenido para tu universo</span>
                </header>
                <UniverseFastActions project={project} universe={universe}/>
            </div>
        </section>
    )
}
