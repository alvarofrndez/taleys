import { useDispatch, useSelector } from 'react-redux'
import { setAuth, setRequires2FA, setTotpCode, setBackupCodes, toggleBackupMode } from '@/stores/authSlice'
import { apiCall } from '@/services/apiCall'
import pushToast from '@/utils/pushToast'

export const useAuth = () => {
    const dispatch = useDispatch()
    const { requires2FA, totpCode, authData, backupCodes, isBackupMode } = useSelector(state => state.auth)

    const handleAuth = async (endpoint, data) => {
        try {
            const response = await apiCall('POST', endpoint, {
                ...authData,
                ...data,
                totp_code: totpCode,
                backup_codes: backupCodes
            })

            if (response) {
                if (response.success) {
                    dispatch(setAuth(response.data))
                } else if (response.message === 'Se requiere código de autenticación de doble factor') {
                    dispatch(setRequires2FA(data))
                    return response
                }

                pushToast(response.message, response.success ? 'success' : 'error')
                return response
            }
        } catch (error) {
            pushToast(error.message, 'error')
        }
    }

    const handle2FASubmit = async (e) => {
        if (e) e.preventDefault()
        
        if (isBackupMode) {
            if (!backupCodes) {
                pushToast('Por favor ingrese los códigos de respaldo', 'error')
                return
            }
        } else {
            if (!totpCode) {
                pushToast('Por favor ingrese el código de autenticación', 'error')
                return
            }
        }
        
        return handleAuth('/auth/login', {})
    }

    const handleTotpChange = (code) => {
        dispatch(setTotpCode(code))
    }

    const handleBackupCodesChange = (codes) => {
        dispatch(setBackupCodes(codes))
    }

    const handleFileUpload = async (file) => {
        try {
            const text = await file.text()
            dispatch(setBackupCodes(text.trim()))
        } catch (error) {
            pushToast('Error al leer el archivo', 'error')
        }
    }

    const handleToggleMode = () => {
        dispatch(toggleBackupMode())
    }

    return {
        requires2FA,
        totpCode,
        backupCodes,
        isBackupMode,
        setTotpCode: handleTotpChange,
        setBackupCodes: handleBackupCodesChange,
        handleFileUpload,
        handleToggleMode,
        handleAuth,
        handle2FASubmit,
        authData
    }
} 