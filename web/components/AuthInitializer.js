'use client'

import { apiCall } from '@/services/apiCall'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { setAuth } from '@/stores/authSlice'
import GlobalLoader from '@/components/GlobalLoader'

const only_no_auth_routes = ['/login', '/sign-in']

export default function AuthInitializer({ children }) {
    const dispatch = useDispatch()
    const router = useRouter()
    const user = useSelector((state) => state.auth.user)
    const [loading, setLoading] = useState(true)
    const pathname = usePathname()
  
    useEffect(() => {
        const isLoggedIn = async () => {
            setLoading(true)
            const response = await apiCall('GET', '/me')
            if(response?.success){
                if(user){
                    if(response.data.id != user.id){
                        dispatch(setAuth(response.data))
                    }
                }else{
                    dispatch(setAuth(response.data))
                }
                
                checkNoAuthRoutes(response.success)
            }else{
                setLoading(false)
            }
        }

        isLoggedIn()
    }, [user])

    const checkNoAuthRoutes = () => {
        if (only_no_auth_routes.some((route) => route === pathname)) {
            router.replace('/')
            setTimeout(() => {
                setLoading(false)
            }, 2000)
        }else{
            setLoading(false)
        }
    }

    if (loading) {
        return <GlobalLoader />
    }

    return children
}