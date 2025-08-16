import { usersAuthProvidersModel } from "./UsersAuthProviders"
import UsersAuthProviders from "./usersAuthProviders.interface"

export const usersAuthProvidersService = {
    getByProvider: async (user_id: number, provider: string) => {
        return await usersAuthProvidersModel.getByProvider(user_id, provider)
    },

    setProvider: async (account: UsersAuthProviders) => {
        return await usersAuthProvidersModel.setProvider(account)
    },
}