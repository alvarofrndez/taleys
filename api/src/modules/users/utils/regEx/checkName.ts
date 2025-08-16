export const checkName = (name: string): boolean | string => {
    if (!name || name.trim() === '') {
        return "El nombre no puede estar vacío"
    }

    if (name.length < 3) {
        return "El nombre debe tener al menos 3 caracteres"
    }

    const name_regEx = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/
    if (!name_regEx.test(name)) {
        return "El nombre solo puede contener letras y espacios"
    }

    return true
}