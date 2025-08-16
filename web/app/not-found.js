'use client'

import Link from 'next/link'

export default function NotFound() {
    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1>404 - Página no encontrada</h1>
            <p>Lo sentimos, no pudimos encontrar lo que buscas.</p>
            <Link href='/'>Volver al inicio</Link>
        </div>
    )
}