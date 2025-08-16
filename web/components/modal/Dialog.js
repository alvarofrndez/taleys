import styles from '@/assets/global/modal/dialog.module.scss'
import { useSelector, useDispatch } from 'react-redux'
import { closeModal, confirmModal } from '@/stores/modalSlice'

const Dialog = () => {
    const dispatch = useDispatch();
    const { props } = useSelector((state) => state.modal)

    return (
        <div className={styles.container} onClick={() => dispatch(closeModal())}>
            <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                <p>{props.message}</p>
                <div className={styles.buttonsContainer}>
                    <button className={styles.confirm} onClick={() => dispatch(confirmModal())}>Confirmar</button>
                    <button className={styles.cancel} onClick={() => dispatch(closeModal())}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default Dialog
