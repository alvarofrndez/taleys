'use client'

import styles from '@/assets/global/modal/create-character.module.scss'
import { useDispatch } from 'react-redux'
import { closeModal } from '@/stores/modalSlice'
import { useState } from 'react'
import pushToast from '@/utils/pushToast'
import { apiCall } from '@/services/apiCall'
import Loader from '@/components/Loader'
import { useRouter } from 'next/navigation'
import Icon from '@/components/iconComponent'

const CreateBookCharacter = ({ project, book }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const BASE_URL = `/projects/${project.id}/characters`

    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        name: '',
        alias: '',
        belonging_level: 'book',
        belonging_id: book.id,
        appearances: [book.id],
        extra_attributes: [] // atributos flexibles { key, value }
    })

    // --- FUNCIONES PARA ATRIBUTOS FLEXIBLES ---
    const addAttribute = () => {
        setForm({
            ...form,
            extra_attributes: [...form.extra_attributes, { key: '', value: '' }]
        })
    }

    const updateAttribute = (index, key, value) => {
        const updated = [...form.extra_attributes]
        updated[index][key] = value
        setForm({ ...form, extra_attributes: updated })
    }

    const removeAttribute = (index) => {
        const updated = [...form.extra_attributes]
        updated.splice(index, 1)
        setForm({ ...form, extra_attributes: updated })
    }

    const handleSubmit = async () => {
        if (form.name.trim() === '') {
            pushToast('El nombre es requerido', 'error')
            return
        }
        if (form.alias.trim() === '') {
            pushToast('El alias es requerido', 'error')
            return
        }

        // limpiar atributos vacíos
        const cleanAttributes = form.extra_attributes.filter(
            (attr) => attr.key.trim() !== '' && attr.value.trim() !== ''
        )

        const payload = { ...form, extra_attributes: cleanAttributes }

        setLoading(true)
        const response = await apiCall('POST', BASE_URL, payload)
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
                    <Icon name='character' alt='personaje' width={15} height={15} />
                    <h3>Nuevo Personaje en Libro</h3>
                </div>
                <p>Crea un nuevo personaje dentro del libro &quot;{book.title}&quot;.</p>
            </header>
        
            <div className={styles.content}>
                <form>
                    <div className={styles.formGroup}>
                        <label htmlFor='name' className={styles.label}>Nombre</label>
                        <div className={styles.inputGroup}>
                            <input
                                type='text'
                                id='name'
                                name='name'
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder='Ej. Aragorn'
                            />
                            <Icon
                                name='cross'
                                alt='Quitar'
                                width={15}
                                height={15}
                                className={styles.delete}
                                color='var(--color-danger)'
                                disabled={true}
                            />
                        </div>
                        
                    </div>
            
                    <div className={styles.formGroup}>
                        <label htmlFor='alias' className={styles.label}>Alias</label>
                        <div className={styles.inputGroup}>
                            <input
                                type='text'
                                id='alias'
                                name='alias'
                                value={form.alias}
                                onChange={(e) => setForm({ ...form, alias: e.target.value })}
                                placeholder='Ej. Trancos'
                            />
                            <Icon
                                name='cross'
                                alt='Quitar'
                                width={15}
                                height={15}
                                className={styles.delete}
                                color='var(--color-danger)'
                                disabled={true}
                            />
                        </div>
                    </div>

                    {form.extra_attributes.map((attr, index) => (
                        <div 
                            key={index}
                            className={styles.formGroup} 
                        >
                            <input
                                type='text'
                                placeholder='Nombre atributo'
                                value={attr.key}
                                className={styles.label}
                                onChange={(e) => updateAttribute(index, 'key', e.target.value)}
                            />
                            <div className={styles.inputGroup}>
                                <input
                                    type='text'
                                    placeholder='Valor atributo'
                                    value={attr.value}
                                    onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                                />

                                <Icon
                                    name='cross'
                                    alt='Quitar'
                                    width={15}
                                    height={15}
                                    className={styles.delete}
                                    onClick={() => removeAttribute(index)}
                                    color='var(--color-danger)'
                                />
                            </div>
                        </div>
                    ))}

                    <button type='button' onClick={addAttribute} className={styles.addInput}>
                        <Icon 
                            name='add'
                            alt='Añadir'
                            width={15}
                            height={15}
                        />
                        <span>Añadir atributo</span>
                    </button>
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
                    disabled={loading}
                >
                    {loading ? <Loader color='foreground' size={15}/> : <span>Crear personaje</span>}
                </button>
            </footer>
        </section>
    )
}

export default CreateBookCharacter
