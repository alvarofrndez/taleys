export const checkPassword = (password) => {
    if(password.trim() == '') return 'Rellene la contraseña'

    return true
}