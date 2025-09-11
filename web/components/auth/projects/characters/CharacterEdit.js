import { useState } from 'react'
import styles from '@/assets/auth/projects/characters/edit.module.scss'
import Image from 'next/image'
import { apiCall } from '@/services/apiCall'
import Loader from '@/components/Loader'
import pushToast from '@/utils/pushToast'
import { useRouter } from 'next/navigation'

export default function CharacterEdit({ character, project, onUpdate }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: character.name || '',
        alias: character.alias || '',
        biography: character.biography || '',
        status: character.status || 'alive',
        gender: character.gender || '',
        age: character.age || '',
        race_species: character.race_species || '',
        profession: character.profession || '',
        motivations: character.motivations || '',
        objectives: character.objectives || '',
        fears: character.fears || '',
        strengths: character.strengths || '',
        weaknesses: character.weaknesses || '',
        physical_description: character.physical_description || '',
        abilities: character.abilities || '',
        limitations: character.limitations || ''
    })

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!formData.name.trim()) {
            pushToast('El nombre del personaje es obligatorio', 'error')
            return
        }

        setLoading(true)

        const response = await apiCall(
            'PUT',
            `/projects/${project.id}/characters/${character.id}`,
            formData
        )

        if (response.success) {
            pushToast(response.message, 'success')
            onUpdate(response.data) // Actualizar el personaje en el componente padre
            
            // Redirigir si el slug cambió
            if (response.data.slug !== character.slug) {
                router.replace(`/${project.created_by.username}/projects/${project.slug}/characters/${response.data.slug}`)
            }
        }

        setLoading(false)
    }


    const handleReset = () => {
        setFormData({
            name: character.name || '',
            alias: character.alias || '',
            biography: character.biography || '',
            status: character.status || 'alive',
            gender: character.gender || '',
            age: character.age || '',
            race_species: character.race_species || '',
            profession: character.profession || '',
            motivations: character.motivations || '',
            objectives: character.objectives || '',
            fears: character.fears || '',
            strengths: character.strengths || '',
            weaknesses: character.weaknesses || '',
            physical_description: character.physical_description || '',
            abilities: character.abilities || '',
            limitations: character.limitations || ''
        })
    }

    const formSections = [
        {
            title: 'Información Básica',
            icon: '/images/icons/user.svg',
            fields: [
                { 
                    name: 'name', 
                    label: 'Nombre *', 
                    type: 'text', 
                    required: true 
                },
                { 
                    name: 'alias', 
                    label: 'Alias/Apodo', 
                    type: 'text' 
                },
                { 
                    name: 'biography', 
                    label: 'Biografía', 
                    type: 'textarea' 
                }
            ]
        },
        {
            title: 'Características Generales',
            icon: '/images/icons/info.svg',
            fields: [
                { 
                    name: 'status', 
                    label: 'Estado', 
                    type: 'select',
                    options: [
                        { value: 'alive', label: 'Vivo' },
                        { value: 'dead', label: 'Muerto' },
                        { value: 'missing', label: 'Desaparecido' },
                        { value: 'unknown', label: 'Desconocido' }
                    ]
                },
                { 
                    name: 'gender', 
                    label: 'Género', 
                    type: 'text' 
                },
                { 
                    name: 'age', 
                    label: 'Edad', 
                    type: 'text' 
                },
                { 
                    name: 'race_species', 
                    label: 'Raza/Especie', 
                    type: 'text' 
                },
                { 
                    name: 'profession', 
                    label: 'Profesión', 
                    type: 'text' 
                }
            ]
        },
        {
            title: 'Descripción Física',
            icon: '/images/icons/eye.svg',
            fields: [
                { 
                    name: 'physical_description', 
                    label: 'Descripción Física', 
                    type: 'textarea' 
                }
            ]
        },
        {
            title: 'Personalidad y Psicología',
            icon: '/images/icons/heart.svg',
            fields: [
                { 
                    name: 'motivations', 
                    label: 'Motivaciones', 
                    type: 'textarea' 
                },
                { 
                    name: 'objectives', 
                    label: 'Objetivos', 
                    type: 'textarea' 
                },
                { 
                    name: 'fears', 
                    label: 'Miedos', 
                    type: 'textarea' 
                }
            ]
        },
        {
            title: 'Habilidades y Capacidades',
            icon: '/images/icons/lightning.svg',
            fields: [
                { 
                    name: 'strengths', 
                    label: 'Fortalezas', 
                    type: 'textarea' 
                },
                { 
                    name: 'weaknesses', 
                    label: 'Debilidades', 
                    type: 'textarea' 
                },
                { 
                    name: 'abilities', 
                    label: 'Habilidades', 
                    type: 'textarea' 
                },
                { 
                    name: 'limitations', 
                    label: 'Limitaciones', 
                    type: 'textarea' 
                }
            ]
        }
    ]

    const renderField = (field) => {
        const commonProps = {
            value: formData[field.name],
            onChange: (e) => handleChange(field.name, e.target.value),
            className: styles.input,
            disabled: loading
        }

        switch (field.type) {
            case 'textarea':
                return (
                    <div key={field.name} className={styles.fieldGroup}>
                        <label className={styles.label}>
                            {field.label}
                            {field.required && <span className={styles.required}>*</span>}
                        </label>
                        <textarea
                            {...commonProps}
                            className={styles.textarea}
                            rows={4}
                        />
                    </div>
                )
            
            case 'select':
                return (
                    <div key={field.name} className={styles.fieldGroup}>
                        <label className={styles.label}>
                            {field.label}
                            {field.required && <span className={styles.required}>*</span>}
                        </label>
                        <select {...commonProps} className={styles.select}>
                            {field.options?.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )
            
            default:
                return (
                    <div key={field.name} className={styles.fieldGroup}>
                        <label className={styles.label}>
                            {field.label}
                            {field.required && <span className={styles.required}>*</span>}
                        </label>
                        <input
                            {...commonProps}
                            type={field.type || 'text'}
                        />
                    </div>
                )
        }
    }

    return (
        <div className={styles.editContainer}>
            <header className={styles.header}>
                <div className={styles.titleContainer}>
                    <Image
                        src="/images/icons/edit.svg"
                        alt="Editar"
                        width={24}
                        height={24}
                    />
                    <h3>Editar {character.name}</h3>
                </div>
                
                <div className={styles.headerActions}>
                    <button 
                        type="button"
                        className={styles.resetButton}
                        onClick={handleReset}
                        disabled={loading}
                    >
                        Restablecer
                    </button>
                </div>
            </header>

            <form onSubmit={handleSubmit} className={styles.form}>
                {formSections.map((section) => (
                    <div key={section.title} className={styles.section}>
                        <header className={styles.sectionHeader}>
                            <div className={styles.sectionTitle}>
                                <Image
                                    src={section.icon}
                                    alt={section.title}
                                    width={20}
                                    height={20}
                                />
                                <h4>{section.title}</h4>
                            </div>
                        </header>
                        
                        <div className={styles.sectionFields}>
                            {section.fields.map(renderField)}
                        </div>
                    </div>
                ))}

                <div className={styles.formActions}>
                    <button 
                        type="submit" 
                        className={styles.saveButton}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader size={16} />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Image
                                    src="/images/icons/check.svg"
                                    alt="Guardar"
                                    width={16}
                                    height={16}
                                />
                                Guardar cambios
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}