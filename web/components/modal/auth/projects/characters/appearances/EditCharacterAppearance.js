'use client'

import styles from '@/assets/global/modal/create-project.module.scss'
import { useDispatch } from 'react-redux'
import { closeModal } from '@/stores/modalSlice'
import { useEffect, useState } from 'react'
import pushToast from '@/utils/pushToast'
import { apiCall } from '@/services/apiCall'
import Loader from '@/components/Loader'
import Icon from '@/components/iconComponent'

const EditCharacterAppearance = ({ project, character, appearance, onClose }) => {
    const dispatch = useDispatch()

    const [global_loading, setGlobalLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [books, setBooks] = useState([])

    const [form, setForm] = useState({
        character_id: character.id,
        book_id: appearance.book_id,
        note: appearance.note || ''
    })

    useEffect(() => {
        const fetchBooks = async () => {
            setGlobalLoading(true)
            const response = await apiCall('GET', `/projects/${project.id}/books`)
            if (response.status) {
                setBooks(response.data)
            }
            setGlobalLoading(false)
        }
        fetchBooks()
    }, [project.id])

    const handleBookChange = (book_id) => {
        const selected_book = books.find(b => Number(b.id) === Number(book_id))
        if (selected_book) {
            setForm({
                ...form,
                book_id: selected_book.id,
            })
        } else {
            setForm({
                ...form,
                book_id: null
            })
        }
    }

    const handleSubmit = async () => {
        if (!form.book_id) {
            pushToast('Debes elegir un libro para la aparición', 'error')
            return
        }

        setLoading(true)
        const response = await apiCall(
            'PUT',
            `/projects/${project.id}/characters/${character.id}/appearances/${appearance.id}`,
            form
        )
        if (response?.success) {
            pushToast(response.message || 'Aparición actualizada', 'success')

            if (typeof onClose === 'function') {
                onClose()
            }

            dispatch(closeModal())
        }
        setLoading(false)
    }

    if (global_loading) return <Loader />

    return (
        <section className={styles.container}>
            <header className={styles.header}>
                <div className={styles.title}>
                    <Icon
                        name='book'
                        alt='aparición'
                        width={15}
                        height={15}
                    />
                    <h3>Editar aparición en libro</h3>
                </div>
                <p>Edita la aparición de &quot;{character.name}&quot; en un libro del proyecto.</p>
            </header>

            <div className={styles.content}>
                <form>
                    <div className={styles.formGroup}>
                        <label htmlFor='book_id'>Libro</label>
                        {books.length > 0
                            ?
                            (
                                <select
                                    id='book_id'
                                    name='book_id'
                                    value={form.book_id || ''}
                                    onChange={(e) => handleBookChange(e.target.value)}
                                >
                                    <option value='' disabled>-- Seleccione --</option>
                                    {books.map((book) => (
                                        <option key={book.id} value={book.id}>
                                            {book.title}
                                        </option>
                                    ))}
                                </select>
                            )
                            :
                            <span>No hay libros en este proyecto</span>
                        }
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor='note'>Nota (opcional)</label>
                        <input
                            type='text'
                            id='note'
                            name='note'
                            value={form.note}
                            onChange={(e) => setForm({ ...form, note: e.target.value })}
                            placeholder='Ej. Capítulo en el que aparece'
                        />
                    </div>
                </form>
            </div>

            <footer className={styles.footer}>
                <button className={styles.close} type='button' onClick={() => dispatch(closeModal())}>
                    Cancelar
                </button>
                <button
                    className={styles.buttonSubmit}
                    type='button'
                    onClick={handleSubmit}
                    disabled={loading || !form.book_id}
                >
                    {loading ? <Loader color='foreground' size={15} /> : <span>Guardar cambios</span>}
                </button>
            </footer>
        </section>
    )
}

export default EditCharacterAppearance
