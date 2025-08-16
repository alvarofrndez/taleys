'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useDispatch } from 'react-redux'
import { setRequires2FA } from '@/stores/authSlice'
import pushToast from '@/utils/pushToast'

const GithubCallback = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const { handleAuth } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      const code = searchParams.get('code')

      if (code) {
        const response = await handleAuth('/auth/github/callback', { code: code })
        if(response?.success) {
          router.replace('/')
        }else{
          dispatch(setRequires2FA(response.data))
          router.replace('/login')
        }
      }else{
        pushToast('Error al autenticar con GitHub', 'error')
        router.replace('/login')
      }
    }

    fetchData()
  }, [searchParams])

  return <p>Autenticando con GitHub...</p>
}

export default GithubCallback
