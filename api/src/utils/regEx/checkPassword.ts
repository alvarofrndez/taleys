export const checkPassword = (password: string, confirm_password?: string): boolean | string => {
    if (!password || password.trim() === '') {
        return "La contraseña no puede estar vacía"
    }

    if (password != confirm_password) {
        return "Las contraseñas deben coincidir"
    }

    // const password_regEx = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/
    // if (!password_regEx.test(password)) {
    //     return "La contraseña"
    // }

    return true
}