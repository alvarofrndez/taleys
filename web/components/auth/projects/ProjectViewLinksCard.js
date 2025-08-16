import { useState } from 'react'
import styles from '@/assets/auth/projects/card-links.module.scss'

export default function ProjectViewLinksCard({ sites = [], videos = [] }) {
    const [activeTab, setActiveTab] = useState('sites')

    return (
        <article className={styles.card}>
            <header>
                <nav>
                    <ul className={styles.tabs}>
                        <li
                            className={`${styles.menuItem} ${activeTab === 'sites' ? styles.active : ''}`}
                            onClick={() => setActiveTab('sites')}
                        >
                            Sitios
                        </li>
                        <li
                            className={`${styles.menuItem} ${activeTab === 'videos' ? styles.active : ''}`}
                            onClick={() => setActiveTab('videos')}
                        >
                            Videos
                        </li>
                    </ul>
                </nav>
            </header>

            <div className={styles.content}>
                {activeTab === 'sites' && (
                    sites.length > 0 ? (
                        sites.map((site) => (
                            <div key={site.id}>
                                <span className={styles.contentProvider}>{site.provider.label}:</span>
                                {site.provider.logo && <span>{site.provider.logo}</span>}
                                <a className={styles.contentUrl} href={site.url}>{site.url}</a>
                            </div>
                        ))
                    ) : (
                        <p>No hay sitios</p>
                    )
                )}

                {activeTab === 'videos' && (
                    videos.length > 0 ? (
                        videos.map((video) => (
                            <div key={video.id}>
                                <a className={styles.contentUrl} href={video.url}>{video.url}</a>
                            </div>
                        ))
                    ) : (
                        <p>No hay videos</p>
                    )
                )}
            </div>
        </article>
    )
}