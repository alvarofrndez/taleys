import { env } from '@/config/config_env'
import CustomError from '@/modules/customerror/CustomError'
import { tagModel } from './Tag'
import { ITag } from './tag.interface'

export const tagService = {
    getById: async (id: number) => {
        return await tagModel.getById(id)
    },

    getByValue: async (value: string) => {
        return await tagModel.getByValue(value)
    },

    create: async (data: ITag) => {
        if(await tagService.getByValue(data.value)) throw new CustomError('La etiqueta ya existe', 400, env.DUPLICATE_DATA_CODE)
            
        const error_message = tagService.checkCreateData(data)
        if(typeof error_message == 'string') throw new CustomError(error_message, 400, env.INVALID_DATA_CODE)

        return await tagModel.create(data)
    },

    checkCreateData: async (data: ITag) => {
        if(data.value.length > 50) return 'La etiqueta debe tener menos de 50 caracteres'

        return true
    }
}  