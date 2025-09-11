import { useSelector } from 'react-redux'
import Link from 'next/link'
import styles from '@/assets/auth/header.module.scss'
import Image from 'next/image'
import UserAvatar from '@/components/auth/MeAvatar'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import React from 'react'

const HeaderComponent = () => {
    const user = useSelector((state) => state.auth.user)
    const router = useRouter()
    const pathname = usePathname()
    const [component, setComponent] = useState(null)

    useEffect(() => {
        const parts = pathname.split('/').filter(Boolean)

        if (parts.length >= 3 && parts[1] === 'projects') {
            const username = decodeURIComponent(parts[0])
            const project_name = decodeURIComponent(parts[2])

            let universeName = null
            let sagaName = null
            let bookName = null
            let characterName = null

            // Detect characters
            if (parts[3] === 'characters' && parts[4]) {
                characterName = decodeURIComponent(parts[4])
                setComponent({
                    type: 'projectView',
                    username,
                    project_name,
                    characterName
                })
            }
            // Detect universes/sagas/books
            else if (parts[3] === 'universes' && parts[4]) {
                universeName = decodeURIComponent(parts[4])
                if (parts[5] === 'sagas' && parts[6]) {
                    sagaName = decodeURIComponent(parts[6])
                    if (parts[7] === 'books' && parts[8]) {
                        bookName = decodeURIComponent(parts[8])
                    }
                } else if (parts[5] === 'books' && parts[6]) {
                    bookName = decodeURIComponent(parts[6])
                }
                setComponent({
                    type: 'projectView',
                    username,
                    project_name,
                    universeName,
                    sagaName,
                    bookName
                })
            } else if (parts[3] === 'sagas' && parts[4]) {
                sagaName = decodeURIComponent(parts[4])
                if (parts[5] === 'books' && parts[6]) {
                    bookName = decodeURIComponent(parts[6])
                }
                setComponent({
                    type: 'projectView',
                    username,
                    project_name,
                    sagaName,
                    bookName
                })
            } else if (parts[3] === 'books' && parts[4]) {
                bookName = decodeURIComponent(parts[4])
                setComponent({
                    type: 'projectView',
                    username,
                    project_name,
                    bookName
                })
            } else {
                setComponent({
                    type: 'projectView',
                    username,
                    project_name
                })
            }
        }
        else if (parts[0] === 'projects' && parts[1] === 'create') {
            setComponent({ type: 'projects/create' })
        }
        else if (parts[0] === 'users' && parts[1]) {
            setComponent({ type: 'users/:username', username: decodeURIComponent(parts[1]) })
        }
        else if (parts[0] === 'settings') {
            setComponent({ type: 'settings' })
        }
        else {
            setComponent(null)
        }
    }, [pathname])

    const AuthButtons = () => (
        <div className={styles.auth}>
            <Link href={'/login'}>Iniciar sesión</Link>
            <Link href={'/sign-in'}>Registrarse</Link>
        </div>
    )

    const UserMenu = () => (
        <div className={styles.user}>
            <Link href={'/notifications'}>
                <Image src={'/images/icons/notification.svg'} alt='notification' width={15} height={15} />
            </Link>
            <Link href={'/messages'}>
                <Image src={'/images/icons/comment.svg'} alt='comment' width={15} height={15} />
            </Link>
            <div className={styles.avatar}>
                <UserAvatar />
            </div>
        </div>
    )

    const Breadcrumbs = ({ username, project_name, universeName, sagaName, bookName, characterName, project_slug, universeSlug, sagaSlug, bookSlug, characterSlug }) => {
        const items = [
            { label: username, href: `/users/${encodeURIComponent(username)}` },
            { label: project_name, href: `/${encodeURIComponent(username)}/projects/${encodeURIComponent(project_slug || project_name)}` }
        ]

        if (characterName) {
            items.push({
                label: characterName,
                href: `/${encodeURIComponent(username)}/projects/${encodeURIComponent(project_slug || project_name)}/characters/${encodeURIComponent(characterSlug || characterName)}`
            })
        } else {
            if (universeName) {
                items.push({
                    label: universeName,
                    href: `/${encodeURIComponent(username)}/projects/${encodeURIComponent(project_slug || project_name)}/universes/${encodeURIComponent(universeSlug || universeName)}`
                })
            }

            if (sagaName) {
                let sagaHref
                if (universeName) {
                    sagaHref = `/${encodeURIComponent(username)}/projects/${encodeURIComponent(project_slug || project_name)}/universes/${encodeURIComponent(universeSlug || universeName)}/sagas/${encodeURIComponent(sagaSlug || sagaName)}`
                } else {
                    sagaHref = `/${encodeURIComponent(username)}/projects/${encodeURIComponent(project_slug || project_name)}/sagas/${encodeURIComponent(sagaSlug || sagaName)}`
                }
                items.push({ label: sagaName, href: sagaHref })
            }

            if (bookName) {
                let bookHref
                if (sagaName && universeName) {
                    bookHref = `/${encodeURIComponent(username)}/projects/${encodeURIComponent(project_slug || project_name)}/universes/${encodeURIComponent(universeSlug || universeName)}/sagas/${encodeURIComponent(sagaSlug || sagaName)}/books/${encodeURIComponent(bookSlug || bookName)}`
                } else if (sagaName) {
                    bookHref = `/${encodeURIComponent(username)}/projects/${encodeURIComponent(project_slug || project_name)}/sagas/${encodeURIComponent(sagaSlug || sagaName)}/books/${encodeURIComponent(bookSlug || bookName)}`
                } else if (universeName) {
                    bookHref = `/${encodeURIComponent(username)}/projects/${encodeURIComponent(project_slug || project_name)}/universes/${encodeURIComponent(universeSlug || universeName)}/books/${encodeURIComponent(bookSlug || bookName)}`
                } else {
                    bookHref = `/${encodeURIComponent(username)}/projects/${encodeURIComponent(project_slug || project_name)}/books/${encodeURIComponent(bookSlug || bookName)}`
                }
                items.push({ label: bookName, href: bookHref })
            }
        }

        return (
            <ul className={styles.breadcums}>
                {items.map((item, i) => (
                    <React.Fragment key={i}>
                        <li>
                            {i < items.length - 1 ? (
                                <Link href={item.href}>{item.label}</Link>
                            ) : (
                                <b>{item.label}</b>
                            )}
                        </li>
                        {i < items.length - 1 && <div className={styles.separator}>/</div>}
                    </React.Fragment>
                ))}
            </ul>
        )
    }

    return (
        <>
        {component === null && (
            <header className={styles.header}>
                <div className={styles.info}>
                    <div className={styles.logo} onClick={() => router.push('/')}>
                        <h3>{process.env.NEXT_PUBLIC_PROJECT_LABEL}</h3>
                    </div>
                    <div className={styles.separator}>/</div>
                    <ul className={styles.breadcums}>
                        <li><span>proyecto</span></li>
                        <div className={styles.separator}>/</div>
                        <li><span>cosmere</span></li>
                        <div className={styles.separator}>/</div>
                        <li><span>saga</span></li>
                    </ul>
                </div>
                {user ? <UserMenu /> : <AuthButtons />}
            </header>
        )}

        {component?.type === 'users/:username' && (
            <header className={styles.header}>
                <div className={styles.logo}>
                    <Image src={'/images/icons/arrow.svg'} onClick={() => router.back()} alt='arrow' width={15} height={15} />
                    <h3>Usuario</h3>
                </div>
                {user ? <UserMenu /> : <AuthButtons />}
            </header>
        )}

        {component?.type === 'projects/create' && (
            <header className={styles.header}>
                <div className={styles.logo}>
                    <Image src={'/images/icons/arrow.svg'} onClick={() => router.back()} alt='arrow' width={15} height={15} />
                    <h3>Subir proyecto</h3>
                </div>
                <UserMenu />
            </header>
        )}

        {component?.type === 'projectView' && (
            <header className={styles.header}>
                <div className={styles.info}>
                    <Image src={'/images/icons/arrow.svg'} onClick={() => router.back()} alt='arrow' width={15} height={15} />
                    <div className={styles.logo} onClick={() => router.push('/')}>
                        <h3>{process.env.NEXT_PUBLIC_PROJECT_LABEL}</h3>
                    </div>
                    <div className={styles.separator}>/</div>
                    <Breadcrumbs
                        username={component.username}
                        project_name={component.project_name}
                        universeName={component.universeName}
                        sagaName={component.sagaName}
                        bookName={component.bookName}
                        characterName={component.characterName}
                        project_slug={component.project_slug}
                        universeSlug={component.universeSlug}
                        sagaSlug={component.sagaSlug}
                        bookSlug={component.bookSlug}
                        characterSlug={component.characterSlug}
                    />
                </div>
                {user ? (
                    <div className={styles.user}>
                        <Link href={'/notifications'}>
                            <Image src={'/images/icons/notification.svg'} alt='notification' width={15} height={15} />
                        </Link>
                        <Link href={'/messages'}>
                            <Image src={'/images/icons/comment.svg'} alt='comment' width={15} height={15} />
                        </Link>
                        <div className={styles.upload} onClick={() => router.push('/projects/create')}>
                            <Image src={'/images/icons/add.svg'} alt='upload' width={15} height={15} />
                            <p>Nuevo proyecto</p>
                        </div>
                        <div className={styles.avatar}>
                            <UserAvatar />
                        </div>
                    </div>
                ) : <AuthButtons />}
            </header>
        )}

        {component?.type === 'settings' && (
            <header className={styles.header}>
                <div className={styles.logo} onClick={() => router.push('/')}>
                    <span>logo</span>
                    <h3>Showys</h3>
                </div>
                <UserMenu />
            </header>
        )}
        </>
    )
}

export default HeaderComponent