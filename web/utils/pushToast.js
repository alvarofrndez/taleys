import store from '@/stores/store'
import { addToast, removeToast } from '@/stores/toastSlice'

const pushToast = (message, type, duration = 3000) => {
    const dispatch = store.dispatch

    const id = Date.now()
    dispatch(addToast({ id: id, message: message, type: type }))

    setTimeout(() => {
        dispatch(removeToast(id))
    }, 3000)
}

export default pushToast