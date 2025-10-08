import { IUser } from "../User.interface"

const noAuthUserResponse = (user: IUser) => {
    const {password, ...user_response} = user

    return user_response
}

export default noAuthUserResponse