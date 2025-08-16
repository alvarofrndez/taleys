'use client'

import { useSelector, useDispatch } from 'react-redux'
import { removeToast } from '@/stores/toastSlice'
import styles from '@/assets/global/toast.module.scss'

export default function ToastContainer() {
  const toasts = useSelector((state) => state.toast.toasts)
  const dispatch = useDispatch()

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
          onClick={() => dispatch(removeToast(toast.id))}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
