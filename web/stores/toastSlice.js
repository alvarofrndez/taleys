import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    toasts: [],
}

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        addToast: (state, action) => {
            state.toasts.push({ id: action.payload.id, ...action.payload })
        },
        removeToast: (state, action) => {
            state.toasts = state.toasts.filter((toast) => toast.id !== action.payload)
        },
    },
})

export const { addToast, removeToast } = toastSlice.actions
export default toastSlice.reducer