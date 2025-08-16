export const checkName = (name) => {
    if(name.trim() == '') return 'Rellene el nombre'

    return true
}