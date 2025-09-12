'use client'

import styles from '@/assets/global/modal/create-project.module.scss'
import { useDispatch } from 'react-redux'
import Image from 'next/image'
import { closeModal } from '@/stores/modalSlice'
import { useState, useEffect } from 'react'
import pushToast from '@/utils/pushToast'
import { apiCall } from '@/services/apiCall'
import Loader from '@/components/Loader'
import { useRouter } from 'next/navigation'
import Icon from '@/components/iconComponent'

const CreateUniverseCharacter = ({ project, universe }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const BASE_URL = `/projects/${project.id}/characters`

    const [loading_global, setLoadingGlobal] = useState(true)
    const [loading, setLoading] = useState(false)

    const [books, setBooks] = useState([])
    const [books_filter, setBooksFilter] = useState([])

    const [form, setForm] = useState({
        name: '',
        alias: '',
        age: '',
        gender: '',
        race_species: '',
        status: 'unknown',
        image_url: '',
        belonging_level: 'universe',
        belonging_id: universe.id,
        biography: '',
        motivations: '',
        objectives: '',
        fears: '',
        strengths: '',
        weaknesses: '',
        profession: '',
        physical_description: '',
        abilities: '',
        limitations: '',
        appearances: [],
    })

    useEffect(() => {
        const fetchData = async () => {
            setLoadingGlobal(true)
            const books_response = await apiCall('GET', `/projects/${project.id}/universes/${universe.id}/books`)
            if (books_response?.success) {
                setBooks(books_response.data)
                setBooksFilter(books_response.data)
            }
            setLoadingGlobal(false)
        }
        fetchData()
    }, [project.id, universe.id])

    const handleAppearanceToggle = (book_id) => {
        const has = form.appearances.includes(book_id)
        setForm({
            ...form,
            appearances: has ? form.appearances.filter(id => id !== book_id) : [...form.appearances, book_id]
        })
    }

    const handleSubmit = async () => {
        if (form.name.trim() === '') {
            pushToast('El nombre es requerido', 'error')
            return
        }

        setLoading(true)
        const payload = { ...form, image_url: form.image_url || null }
        const response = await apiCall('POST', BASE_URL, payload)

        if (response?.success) {
            pushToast(response.message || 'Personaje creado', 'success')
                dispatch(closeModal())
                router.push(`/${project.created_by.username}/projects/${project.slug}/characters/${response.data.slug}`)
        }
        setLoading(false)
    }

    if (loading_global) return <Loader />

    return (
        <section className={styles.container}>
            <header className={styles.header}>
                <div className={styles.title}>
                    <Icon
                        name='character'
                        alt='personaje'
                        width={20}
                        height={20}
                    />
                    <h2>Nuevo Personaje en Universo</h2>
                </div>
                <button onClick={() => dispatch(closeModal())} className={styles.closeButton} aria-label='close'>
                    <Icon
                        name='close'
                        alt='cerrar'
                        width={20}
                        height={20}
                    />
                </button>
            </header>

            <main className={styles.main}>
                <div className={styles.inputGroup}>
                    <label>Nombre</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder='Nombre del personaje' />
                </div>
                <div className={styles.dualGroup}>
                    <div className={styles.inputGroup}>
                        <label>Alias</label>
                        <input value={form.alias} onChange={e => setForm({ ...form, alias: e.target.value })} placeholder='Alias' />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Estado</label>
                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                            <option value='unknown'>Desconocido</option>
                            <option value='alive'>Vivo</option>
                            <option value='dead'>Muerto</option>
                        </select>
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>Apariciones (Libros)</label>
                    <div className={styles.checkboxList}>
                        {books_filter.map(book => (
                            <label key={book.id} className={styles.checkboxItem}>
                                <input
                                    type='checkbox'
                                    checked={form.appearances.includes(book.id)}
                                    onChange={() => handleAppearanceToggle(book.id)}
                                />
                                <span>{book.title}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                <button onClick={() => dispatch(closeModal())} className={styles.cancelButton}>Cancelar</button>
                <button onClick={handleSubmit} className={styles.submitButton} disabled={loading}>
                    {loading ? <Loader size={20}/> : 'Crear'}
                </button>
            </footer>
        </section>
    )
}

export default CreateUniverseCharacter


