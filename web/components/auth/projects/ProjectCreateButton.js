import styles from '@/assets/auth/projects/create-button.module.scss'
import { useDispatch } from 'react-redux'
import { openModal } from '@/stores/modalSlice'
import { useSelector } from 'react-redux'
import pushToast from '@/utils/pushToast'
import Icon from '@/components/iconComponent'

const ProjectCreateButton = () => {
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()

    const create = () => {
        if(!user){
            pushToast('Debes inicar sesión', 'error')
            return
        }
        dispatch(openModal({
            component: 'CreateProject'
        }))
    }

    return (
        <button className={styles.createButton} onClick={create}>
            <Icon
                name='add'
                width={15}
                height={15}
                alt='crear'
            />
            <span>Nuevo proyecto</span>
        </button>
    )
}

export default ProjectCreateButton