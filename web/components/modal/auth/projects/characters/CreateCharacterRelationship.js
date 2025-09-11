'use client'

import styles from '@/assets/global/modal/create-project.module.scss'
import { useDispatch } from 'react-redux'
import Image from 'next/image'
import { closeModal } from '@/stores/modalSlice'
import { useEffect, useState } from 'react'
import pushToast from '@/utils/pushToast'
import { apiCall } from '@/services/apiCall'
import Loader from '@/components/Loader'

const CreateCharacterRelationship = ({ project, character }) => {
    const dispatch = useDispatch()

    const [global_loading, setGlobalLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [characters, setCharacters] = useState([])
    const [relation_types, setRelationTypes] = useState([
        {
            value: 'ally',
            label: 'Aliado'
        },
        {
            value: 'enemy',
            label: 'Enemigo'
        },
        {
            value: 'family',
            label: 'Familia'
        },
        {
            value: 'romantic',
            label: 'Romántica'
        },
        {
            value: 'mentor',
            label: 'Mentor'
        },
        {
            value: 'neutral',
            label: 'Neutral'
        }
    ])

    const [form, setForm] = useState({
        character_id: character.id,
        related_character_id: undefined,
        relation_type: undefined,
        note: undefined
    })

    useEffect(() => {
        const fetchCharacters = async () => {
            setGlobalLoading(true)

            let partial_url = character.belonging_level != 'project' ? `${character.belonging_level}s/${character.belonging_id}/characters` : 'characters'

            const response = await apiCall('GET', `/projects/${project.id}/${partial_url}`)

            if(response.status){
                response.data = response.data.filter((c) => c.id != character.id)
                setCharacters(response.data)
            }

            setGlobalLoading(false)
        }
        
        fetchCharacters()
    }, [])

    const handleCharacterChange = (related_character_id) => {
        const selected_related_character = characters.find(character => Number(character.id) === Number(related_character_id))
        if (selected_related_character) {
            setForm({
                ...form,
                related_character_id: selected_related_character.id,
            })
        } else {
            setForm({
                ...form,
                related_character_id: null
            })
        }
    }

    const handleRelationTypeChange = (relation_type_value) => {
        const selected_relation_type = relation_types.find(relation_type => relation_type.value === relation_type_value)
        if (selected_relation_type) {
            setForm({
                ...form,
                relation_type: selected_relation_type.value,
            })
        } else {
            setForm({
                ...form,
                relation_type: null
            })
        }
    }

    const handleSubmit = async () => {
        if (!form.related_character_id) {
            pushToast('Debes elegir un personaje para relacionar', 'error')
            return
        }

        setLoading(true)
        const response = await apiCall('POST', `/projects/${project.id}/characters/${character.id}/relationships`, form)
        if (response?.success) {
            pushToast(response.message || 'Relación creada', 'success')
            dispatch(closeModal())
        }
        setLoading(false)
    }

    if (global_loading) return <Loader />

    return (
        <section className={styles.container}>
            <header className={styles.header}>
                <div className={styles.title}>
                    <Image src={'/images/icons/users.svg'} alt='relación icon' width={15} height={15} />
                    <h3>Nueva relación entre Personajes</h3>
                </div>
                <p>Crea una nueva relación entre &quot;{character.name}&quot; y el personaje que tu elijas.</p>
            </header>
        
            <div className={styles.content}>
                <form>
                        <div className={styles.formGroup}>
                            <label htmlFor='related_character_id'>Personaje a relacionar</label>
                            {characters.length > 0 
                                ? 
                                    (
                                        <select
                                            id='related_character_id'
                                            name='related_character_id'
                                            value={form.related_character_id || ''}
                                            onChange={(e) => handleCharacterChange(e.target.value)}
                                        >
                                            <option value='' disabled>-- Seleccione --</option>
                                            {characters.map((character) => (
                                                <option key={character.id} value={character.id}>
                                                    {character.name} - {character.belonging_object.name ?? character.belonging_object.title}
                                                </option>
                                            ))}
                                        </select>
                                    )
                                :
                                    <span>No hay personajes para relacionar</span>
                            }
                        </div>

                    {relation_types.length > 0 && (
                        <div className={styles.formGroup}>
                            <label htmlFor='relation_type'>Tipo de relación</label>
                            <select
                                id='relation_type'
                                name='relation_type'
                                value={form.relation_type || ''}
                                onChange={(e) => handleRelationTypeChange(e.target.value)}
                            >
                                <option value='' disabled>-- Seleccione --</option>
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
                            value={form.note}
                            onChange={(e) => setForm({ ...form, note: e.target.value })}
                            placeholder='Ej. Es una relación muy fría'
                        />
                    </div>
                </form>
            </div>
        
            <footer className={styles.footer}>
                <button className={styles.close} type='button' onClick={() => dispatch(closeModal())}>
                    Cancelar
                </button>
                <button className={styles.buttonSubmit} type='button' onClick={handleSubmit} disabled={loading || !form.related_character_id}>
                    {loading ? <Loader color='foreground' size={15}/> : <span>Crear relación</span>}
                </button>
            </footer>
        </section>
    )
}

export default CreateCharacterRelationship