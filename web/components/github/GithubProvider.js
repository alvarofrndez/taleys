'use client'

import styles from '@/assets/noAuth/auth.module.scss'
import Image from 'next/image'
import pushToast from '@/utils/pushToast'
import Icon from '@/components/iconComponent'

const GitHubProvider = ({ terms = true }) => {
    const loginWithGitHub = () => {
        if(!terms) return pushToast('Debes aceptar los términos y condiciones para continuar', 'error')
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_AUTH_CLIENT_ID}&scope=user:email&prompt=consent`
    }

    return <button className={styles.buttonProvider} type='button' onClick={loginWithGitHub}> 
        <Icon
            name='github'
            alt='logo github'
            width={28}
            height={28}
        />
        <span>GitHub</span>
    </button>
}

export default GitHubProvider