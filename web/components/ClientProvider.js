'use client'

import { Provider } from 'react-redux'
import store from '@/stores/store'
import AuthInitializer from '@/components/AuthInitializer'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ToastContainer from '@/components/ToastContainer'
import ModalContainer from '@/components/ModalContainer'

export default function ClientProvider({ children }) {
    return (
        <Provider store={store}>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID}>
                <AuthInitializer>
                    {children}
                </AuthInitializer>
                <ToastContainer />
                <ModalContainer />
            </GoogleOAuthProvider>
        </Provider>
    )
}