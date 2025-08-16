export const checkEmail = (email) => {
    if(email.trim() == '') return 'Rellene los campos'

    return true
}