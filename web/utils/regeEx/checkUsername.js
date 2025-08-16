export const checkUsername = (username) => {
    if(username.trim() == '') return 'Rellene los campos'

    return true
}