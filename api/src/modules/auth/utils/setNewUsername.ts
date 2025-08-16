const setNewUsername = (username: string) => {
    return username + '_' + (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000).toString()
}

export default setNewUsername