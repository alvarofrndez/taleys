'use client'

import styles from '@/assets/global/modal/create-project.module.scss'
import { useDispatch } from 'react-redux'
import { closeModal } from '@/stores/modalSlice'
import { useEffect, useState } from 'react'
import pushToast from '@/utils/pushToast'
import { apiCall } from '@/services/apiCall'
import Loader from '@/components/Loader'
import Icon from '@/components/iconComponent'

const EditCharacterRelationship = ({ project, character, relationship, onClose }) => {
    const dispatch = useDispatch()

    const [global_loading, setGlobalLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [characters, setCharacters] = useState([])
    const [relation_types] = useState([
        { value: 'ally', label: 'Aliado' },
        { value: 'enemy', label: 'Enemigo' },
        { value: 'family', label: 'Familia' },
        { value: 'romantic', label: 'Romántica' },
        { value: 'mentor', label: 'Mentor' },
        { value: 'neutral', label: 'Neutral' }
    ])

    const [form, setForm] = useState({
        character_id: character.id,
        related_character_id: relationship?.related_character_id ?? undefined,
        relation_type: relationship?.relation_type ?? undefined,
        note: relationship?.note ?? ''
    })

    useEffect(() => {
        const fetchCharacters = async () => {
            setGlobalLoading(true)

            let partial_url =
                character.belonging_level != 'project'
                    ? `${character.belonging_level}s/${character.belonging_id}/characters`
                    : 'characters'

            const response = await apiCall('GET', `/projects/${project.id}/${partial_url}`)

            if (response.status) {
                response.data = response.data.filter((c) => c.id != character.id)
                setCharacters(response.data)
            }

            setGlobalLoading(false)
        }

        fetchCharacters()
    }, [project.id, character])

    const handleSubmit = async () => {
        if (!form.related_character_id) {
            pushToast('Debes elegir un personaje para relacionar', 'error')
            return
        }

        setLoading(true)
        const response = await apiCall(
            'PUT',
            `/projects/${project.id}/characters/${character.id}/relationships/${relationship.id}`,
            form
        )
        if (response?.success) {
            pushToast(response.message || 'Relación actualizada', 'success')

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
                    <Icon name='users' alt='relación' width={15} height={15} />
                    <h3>Editar relación entre Personajes</h3>
                </div>
                <p>
                    Edita la relación entre &quot;{character.name}&quot; y el personaje relacionado.
                </p>
            </header>

            <div className={styles.content}>
                <form>
                    <div className={styles.formGroup}>
                        <label htmlFor='related_character_id'>Personaje relacionado</label>
                        {characters.length > 0 ? (
                            <select
                                id='related_character_id'
                                name='related_character_id'
                                value={form.related_character_id || ''}
                                onChange={(e) =>
                                    setForm({ ...form, related_character_id: Number(e.target.value) })
                                }
                            >
                                <option value='' disabled>
                                    -- Seleccione --
                                </option>
                                {characters.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} - {c.belonging_object.name ?? c.belonging_object.title}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <span>No hay personajes disponibles</span>
                        )}
                    </div>

                    {relation_types.length > 0 && (
                        <div className={styles.formGroup}>
                            <label htmlFor='relation_type'>Tipo de relación</label>
                            <select
                                id='relation_type'
                                name='relation_type'
                                value={form.relation_type || ''}
                                onChange={(e) => setForm({ ...form, relation_type: e.target.value })}
                            >
                                <option value='' disabled>
                                    -- Seleccione --
                                </option>
                                {relation_types.map((relation_type) => (
                                    <option key={relation_type.value} value={relation_type.value}>
                                        {relation_type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor='note'>Nota (opcional)</label>
                        <input
                            type='text'
                            id='note'
                            name='note'
                            value={form.note || ''}
                            onChange={(e) => setForm({ ...form, note: e.target.value })}
                            placeholder='Ej. Es una relación complicada'
                        />
                    </div>
                </form>
            </div>

            <footer className={styles.footer}>
                <button
                    className={styles.close}
                    type='button'
                    onClick={() => dispatch(closeModal())}
                >
                    Cancelar
                </button>
                <button
                    className={styles.buttonSubmit}
                    type='button'
                    onClick={handleSubmit}
                    disabled={loading || !form.related_character_id}
                >
                    {loading ? <Loader color='foreground' size={15} /> : <span>Guardar cambios</span>}
                </button>
            </footer>
        </section>
    )
}

export default EditCharacterRelationship