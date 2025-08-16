import styles from '@/assets/auth/header.module.scss'
import { useDispatch } from 'react-redux'
import { openModal } from '@/stores/modalSlice'

const ProjectCreateButton = () => {
    const dispatch = useDispatch()

    const create = () => {
        dispatch(openModal({
            component: 'CreateProject'
        }))
    }

    return (
        <button className={styles.newProjectBtn} onClick={create}>
            + Nuevo proyecto
        </button>
    )
}

export default ProjectCreateButton