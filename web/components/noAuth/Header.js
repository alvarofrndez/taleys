import Link from 'next/link'
import styles from '@/assets/noAuth/header.module.scss'

const HeaderComponent = () => {
    return (
        <header className={styles.header}>
            <div>
                <Link href={'/'}>showys</Link>
            </div>
        </header>
    )
}

export default HeaderComponent