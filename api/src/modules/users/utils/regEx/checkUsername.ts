export const checkUsername = (username: string): boolean | string => {
    if (!username || username.trim() === '') {
        return "El nombre de usuario no puede estar vacío"
    }

    if (username.length < 3) {
        return "El nombre de usuario debe tener al menos 3 caracteres"
    }

    const name_regEx = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/
    if (!name_regEx.test(username)) {
        return "El nombre de usuario solo puede contener letras y espacios"
    }

    return true
}