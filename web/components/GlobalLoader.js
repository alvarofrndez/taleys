import styles from '@/assets/global/global-loader.module.scss'
import LoaderComponent from '@/components/Loader'

export default function GlobalLoader() {
    return (
        <div className={styles.container}>
            <LoaderComponent />
        </div>
    )
}
