'use client'

import styles from '@/assets/global/modal/create-character.module.scss'
import { useDispatch } from 'react-redux'
import { closeModal } from '@/stores/modalSlice'
import { useState, useEffect } from 'react'
import pushToast from '@/utils/pushToast'
import { apiCall } from '@/services/apiCall'
import Loader from '@/components/Loader'
import { useRouter } from 'next/navigation'
import Icon from '@/components/iconComponent'
import MultiSelect from '@/components/Multiselect'

const CreateUniverseCharacter = ({ project, universe }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const BASE_URL = `/projects/${project.id}/characters`

    const [loading_global, setLoadingGlobal] = useState(true)
    const [loading, setLoading] = useState(false)

    const [books, setBooks] = useState([])

    const [form, setForm] = useState({
        name: '',
        alias: '',
        belonging_level: 'universe',
        belonging_id: universe.id,
        appearances: [],
        extra_attributes: []
    })

    useEffect(() => {
        const fetchData = async () => {
            setLoadingGlobal(true)
            const res = await apiCall('GET', `/projects/${project.id}/universes/${universe.id}/books`)
            if (res?.success) {
                setBooks(res.data)
            }
            setLoadingGlobal(false)
        }
        fetchData()
    }, [project.id, universe.id])

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

    if (loading_global) return <Loader />

    return (
        <section className={styles.container}>
            <header className={styles.header}>
                <div className={styles.name}>
                    <Icon name='character' alt='personaje' width={15} height={15} />
                    <h3>Nuevo Personaje en Universo</h3>
                </div>
                <p>Crea un nuevo personaje dentro del universo &quot;{universe.name}&quot;.</p>
            </header>
        
            <div className={styles.content}>
                <form>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Apariciones en Libros</label>

                        <MultiSelect
                            items={books}
                            selected_items={books.filter((b) => form.appearances.includes(b.id))}
                            onChange={(newSelection) => {
                                setForm({
                                ...form,
                                appearances: newSelection.map((item) => item.id),
                                })
                            }}
                            display_property='title'
                            value_property='id'
                            placeholder='Selecciona libros...'
                            searchable={true}
                            show_select_all={true}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Nombre</label>
                        <div className={styles.inputGroup}>
                            <input
                                type='text'
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder='Ej. Rand al’Thor'
                            />
                            <Icon name='cross' width={15} height={15} disabled={true} className={styles.delete} />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Alias</label>
                        <div className={styles.inputGroup}>
                            <input
                                type='text'
                                value={form.alias}
                                onChange={(e) => setForm({ ...form, alias: e.target.value })}
                                placeholder='Ej. El Dragón Renacido'
                            />
                            <Icon name='cross' width={15} height={15} disabled={true} className={styles.delete} />
                        </div>
                    </div>

                    {form.extra_attributes.map((attr, index) => (
                        <div key={index} className={styles.formGroup}>
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
                                    color='var(--color-danger)'
                                    className={styles.delete}
                                    onClick={() => removeAttribute(index)}
                                />
                            </div>
                        </div>
                    ))}

                    <button type='button' onClick={addAttribute} className={styles.addInput}>
                        <Icon name='add' alt='Añadir' width={15} height={15} />
                        <span>Añadir atributo</span>
                    </button>
                </form>
            </div>
        
            <footer className={styles.footer}>
                <button type='button' className={styles.close} onClick={() => dispatch(closeModal())}>
                    Cancelar
                </button>
                <button 
                    type='button' 
                    className={styles.buttonSubmit} 
                    onClick={handleSubmit} 
                    disabled={loading}
                >
                    {loading ? <Loader color='foreground' size={15}/> : <span>Crear personaje</span>}
                </button>
            </footer>
        </section>
    )
}

export default CreateUniverseCharacter
