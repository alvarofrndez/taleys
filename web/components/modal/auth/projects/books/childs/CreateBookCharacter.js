'use client'

import styles from '@/assets/global/modal/create-project.module.scss'
import { useDispatch } from 'react-redux'
import Image from 'next/image'
import { closeModal } from '@/stores/modalSlice'
import { useState } from 'react'
import pushToast from '@/utils/pushToast'
import { apiCall } from '@/services/apiCall'
import Loader from '@/components/Loader'
import { useRouter } from 'next/navigation'

const CreateBookCharacter = ({ project, book }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const BASE_URL = `/projects/${project.id}/characters`

    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        name: '',
        alias: '',
        race: '',
        status: 'unknown',
        belonging_level: 'book',
        belonging_id: book.id,
        appearances: [book.id]
    })

    const handleSubmit = async () => {
        if (form.name.trim() === '') {
            pushToast('El nombre es requerido', 'error')
            return
        }

        setLoading(true)
        const response = await apiCall('POST', BASE_URL, form)
        if (response?.success) {
            pushToast(response.message || 'Personaje creado', 'success')
            dispatch(closeModal())
            router.push(`/${project.created_by.username}/projects/${project.slug}/characters/${response.data.slug}`)
        }
        setLoading(false)
    }

    return (
        <section className={styles.container}>
            <header className={styles.header}>
                <div className={styles.title}>
                    <Image src={'/images/icons/character.svg'} alt='character icon' width={15} height={15} />
                    <h3>Nuevo Personaje en Libro</h3>
                </div>
                <p>Crea un nuevo personaje dentro del libro &quot;{book.name}&quot;.</p>
            </header>
        
            <div className={styles.content}>
                <form>
                    <div className={styles.formGroup}>
                        <label htmlFor='name'>Nombre</label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder='Ej. Aragorn'
                        />
                    </div>
            
                    <div className={styles.formGroup}>
                        <label htmlFor='alias'>Alias</label>
                        <input
                            type='text'
                            id='alias'
                            name='alias'
                            value={form.alias}
                            onChange={(e) => setForm({ ...form, alias: e.target.value })}
                            placeholder='Ej. Trancos'
                        />
                    </div>
            
                    <div className={styles.formGroup}>
                        <label htmlFor='race'>Raza/Especie</label>
                        <input
                            type='text'
                            id='race'
                            name='race'
                            value={form.race}
                            onChange={(e) => setForm({ ...form, race: e.target.value })}
                            placeholder='Ej. Humano'
                        />
                    </div>
            
                    <div className={styles.formGroup}>
                        <label htmlFor='status'>Estado</label>
                        <select
                            id='status'
                            name='status'
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                        >
                            <option value='alive'>Vivo</option>
                            <option value='dead'>Muerto</option>
                            <option value='unknown'>Desconocido</option>
                        </select>
                    </div>
                </form>
            </div>
        
            <footer className={styles.footer}>
                <button className={styles.close} type='button' onClick={() => dispatch(closeModal())}>
                    Cancelar
                </button>
                <button className={styles.buttonSubmit} type='button' onClick={handleSubmit} disabled={loading}>
                    {loading ? <Loader color='foreground' size={15}/> : <span>Crear personaje</span>}
                </button>
            </footer>
        </section>
    )
}

export default CreateBookCharacter


