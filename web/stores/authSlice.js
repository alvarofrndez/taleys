import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    requires2FA: false,
    totpCode: '',
    backupCodes: '',
    authData: null,
    isBackupMode: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.user = action.payload
            state.requires2FA = false
            state.authData = null
            state.totpCode = ''
            state.backupCodes = ''
            state.isBackupMode = false
        },
        logout: (state) => {
            state.user = null
            state.requires2FA = false
            state.authData = null
            state.totpCode = ''
            state.backupCodes = ''
            state.isBackupMode = false
        },
        setRequires2FA: (state, action) => {
            state.requires2FA = true
            state.authData = action.payload
        },
        setTotpCode: (state, action) => {
            state.totpCode = action.payload
        },
        setBackupCodes: (state, action) => {
            state.backupCodes = action.payload
        },
        toggleBackupMode: (state) => {
            state.isBackupMode = !state.isBackupMode
            state.totpCode = ''
            state.backupCodes = ''
        },
        resetAuth: (state) => {
            state.user = null
            state.requires2FA = false
            state.authData = null
            state.totpCode = ''
            state.backupCodes = ''
            state.isBackupMode = false
        }
    }
})

export const { 
    setAuth, 
    logout, 
    setRequires2FA, 
    setTotpCode, 
    setBackupCodes,
    toggleBackupMode,
    resetAuth 
} = authSlice.actions

export default authSlice.reducer