import Link from "next/link"

const InvalidToken = () => {
    return (
        <div>
            <p>El token ha expirado o es invalido</p>
            <Link href={'/'}>Volver al inicio</Link>
        </div>
    )
}

export default InvalidToken