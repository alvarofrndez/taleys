import styles from '@/assets/global/loader.module.scss'
import React from 'react'

const Loader = ({ color = 'background', size = 30 }) => {
    return (
        <div className={`${styles.loader} ${color === 'foreground' ? styles.foreground : ''}`} style={{ width: size, height: size }}>
            <div className={styles.loader_spinner}></div>
        </div>
    )
}

export default Loader