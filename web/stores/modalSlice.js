import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    is_open: false,
    component: null,
    props: {},
}

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, action) => {
            state.is_open = true
            state.component = action.payload.component
            state.props = action.payload.props || {}
        },
        closeModal: (state) => {
            state.is_open = false
            state.component = null
            state.props = {}
        },

        confirmModal: (state) => {
            state.is_open = false
            state.component = null
            state.props = {}
        },
    },
})

export const { openModal, closeModal, confirmModal } = modalSlice.actions
export default modalSlice.reducer
