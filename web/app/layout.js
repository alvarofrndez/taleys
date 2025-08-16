import '@/assets/global.scss'
import ClientProvider from '@/components/ClientProvider'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: process.env.NEXT_PUBLIC_PROJECT_NAME,
  description: 'Escribe todas las historias que salen de tu imaginación sin ningún tipo de límite',
}

export default function RootLayout({ children }) {
  return (
    <html lang='es'>
      <body className={inter.className}>
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  )
}