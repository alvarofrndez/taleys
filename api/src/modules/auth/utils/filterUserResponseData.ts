import { IUser } from '@/modules/users/User.interface'

const filterUserResponseData = (user: IUser) => {
    const {password, ...user_response} = user

    return user_response as IUser
}

export default filterUserResponseData