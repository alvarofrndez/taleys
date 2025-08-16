export const checkEmail = (email: string): boolean | string => {
    if (!email || email.trim() === '') {
        return "El email no puede estar vacío"
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailPattern.test(email)) {
        return "El email no tiene un formato válido"
    }

    return true
}