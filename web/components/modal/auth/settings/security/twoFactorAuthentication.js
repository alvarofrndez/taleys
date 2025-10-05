'use client'

import styles from '@/assets/global/modal/two-factor-authentication.module.scss'
import { apiCall } from '@/services/apiCall'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import pushToast from '@/utils/pushToast'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, confirmModal } from '@/stores/modalSlice'
import Loader from '@/components/Loader'
import Icon from '@/components/iconComponent'
import Fallback from '@/components/Fallback'

const TwoFactorAuthenticationComponent = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const [qr_code, setQrCode] = useState(undefined)
  const [manual_key, setManualKey] = useState(undefined)
  const [totp_code, setTotpCode] = useState(undefined)
  const [backup_codes, setBackupCodes] = useState(undefined)
  const [loading_general, setLoadingGeneral] = useState(true)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    const fectData = async () => {
      setLoadingGeneral(true)
      const response = await apiCall('GET', '/security/generate-2fa')

      if(response.success){
        setQrCode(response.data.qr_code)
        setManualKey(response.data.secret.base32)
      }
      setLoadingGeneral(false)
    }

    fectData()
  }, [])

  const handleTotp = async () => {
    setLoading(true)

    if(totp_code?.length != 6) {
      pushToast('El formato del codigo es invalido', 'error')
      setLoading(false)
      return
    }

    const response_totp = await apiCall('POST', '/security/enable-2fa', {totp_code, secret: manual_key})

    pushToast(response_totp.message, response_totp.success ? 'success' : 'error')

    if(response_totp.success){
      const response_backup = await apiCall('GET', '/security/generateBackupCodes')

      if(response_backup.success){
        setBackupCodes(response_backup.data)
      }
    }
    setLoading(false)
  }

  const downloadBackup = (e) => {
    e.preventDefault()

    let file_content = backup_codes

    const blob = new Blob([file_content], { type: 'text/plain' })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `showys_${user.email}_backup_codes.txt`

    link.click()
  }

  const copyManualKey = () => {
    navigator.clipboard.writeText(manual_key)
    pushToast('Clave copiada al portapapeles', 'success')
  }

    return loading_general ? (
      <Fallback type='modal' />
    ) 
    : 
    (
      qr_code &&
      <section className={styles.container}>
        <div className={styles.containerTop}>
          <header className={styles.header}>
            <div className={styles.title}>
              <h3>Configurar autenticación de dos factores</h3>
            </div>
            <p>Añade una capa adicional de seguridad a tu cuenta.</p>
          </header>

          {
            step == 1 ?
              <div className={styles.content}>
                <article className={styles.why}>
                  <h3>¿Por qué activar 2FA?</h3>
                  <p>La autenticación de dos factores añade una capa adicional de seguridad a tu cuenta, requiriendo tanto tu contraseña como un código temporal generado por una aplicación.</p>
                </article>

                <div className={styles.step}>
                  <p className={styles.title}>1. Descarga una aplicación de autenticación</p>
                  <p className={styles.description}>Recomendamos Google Authenticator, Authy o Microsoft Authenticator.</p>
                </div>

                <div className={styles.step}>
                  <p className={styles.title}>2. Escanea el código QR</p>
                  <div className={styles.qr_code}>
                    <Image src={qr_code} alt='QR Code' width={128} height={128}/>
                  </div>
                </div>

                <div className={styles.step}>
                  <p className={styles.title}>3. O ingresa esta clave secreta manualmente</p>
                  <div className={styles.manual_key}>
                    <span className={styles.manual_key_text}>{manual_key}</span>
                    <Icon
                      name='copy'
                      alt='copiar'
                      width={20}
                      height={20}
                      className={styles.buttonCopy}
                      onClick={copyManualKey}
                    />
                  </div>
                </div>
              </div>
            :
              <div className={styles.content}>
                { !backup_codes ?
                  <form className={styles.formTotp} onSubmit={handleTotp}>
                    <label htmlFor='totp_code'>Código de verificación</label>
                    <input className={styles.inputTotp} type='number' value={totp_code} name='totp_code' onChange={(e) => setTotpCode(e.target.value)} placeholder='XXXXXX'/>
                    <span>Introduce el código de 6 dígitos de tu aplicación de autenticación.</span>
                  </form>
                :
                  <form className={styles.formBackup} onSubmit={() => dispatch(confirmModal())}>
                    <div className={styles.backupCodes}>
                      <label htmlFor='backup_codes'>Guarda los códigos para poder recuperra tu cuenta</label>
                      <div className={styles.backupCodesInput}>
                        <input className={styles.inputBackup} type='text' value={backup_codes} name='backup_codes' onChange={(e) => setBackupCodes(e.target.value)} placeholder='XXXXXX'/>
                        <Icon
                          name='download'
                          alt='descargar'
                          width={20}
                          height={20}
                          className={styles.buttonBackup}
                          onClick={downloadBackup}
                        />
                      </div>
                      <span>Guarda los códigos para poder recuperar tu cuenta en caso de que olvides tu contraseña.</span>
                    </div>
                  </form>
                }
              </div>
          }
        </div>
        
        <footer className={styles.footer}>
          <button className={styles.close} onClick={() => dispatch(closeModal())} type='button'>Cancelar</button>
          
          {step == 1 ?
            <button className={styles.buttonNext} onClick={() => setStep(2)} type='button'>Continuar</button>
          :
            <div className={styles.buttonsRightContainer}>
              <button className={styles.buttonPrevious} onClick={() => setStep(1)} type='button'>Atrás</button>
              <button className={styles.buttonNext} onClick={handleTotp} type='button' disabled={backup_codes}>
                {
                  loading ?
                    <Loader color='foreground'/>
                  :
                    <span>Verificar</span>
                }
              </button>
            </div>
          }
        </footer>
      </section>
    )
  }
  
export default TwoFactorAuthenticationComponent