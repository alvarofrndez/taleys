'use client'

import styles from '@/assets/global/modal/create-project.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import pushToast from '@/utils/pushToast'
import Loader from '@/components/Loader'
import { closeModal, confirmModal } from '@/stores/modalSlice'

const DeleteProjectConfirmation = ({ project }) => {
    const dispatch = useDispatch()
    const { props } = useSelector(state => state.modal)
    const [inputValue, setInputValue] = useState('')
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (inputValue !== project.name) {
            pushToast('El nombre ingresado no coincide con el proyecto', 'error')
            return
        }

        if (props.onConfirmCallback) {
            await props.onConfirmCallback();
        }

        dispatch(confirmModal());
    }

    return (
        <section className={styles.container}>
            <div className={styles.containerTop}>
                <header className={styles.header}>
                    <div className={styles.title}>
                        <h3>Eliminar proyecto</h3>
                    </div>
                    <p>Esta acción es irreversible. Para confirmar, escribe el nombre del proyecto: <strong>{project.name}</strong></p>
                </header>

                <div className={styles.content}>
                    <form>
                        <div className={styles.formGroup}>
                            <label htmlFor='project_name'>Nombre del proyecto</label>
                            <input
                                type='text'
                                id='project_name'
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={`Escribe "${project.name}" para confirmar`}
                            />
                        </div>
                    </form>
                </div>
            </div>

            <footer className={styles.footer}>
                <button
                    className={styles.close}
                    type='button'
                    onClick={() => dispatch(closeModal())}
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    className={styles.buttonSubmit}
                    type='button'
                    onClick={handleDelete}
                    disabled={loading || inputValue !== project.name}
                >
                    {loading ? <Loader color='foreground' size={15}/> : <span>Eliminar proyecto</span>}
                </button>
            </footer>
        </section>
    )
}

export default DeleteProjectConfirmation