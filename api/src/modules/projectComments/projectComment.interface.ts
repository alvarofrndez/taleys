import { IUser } from '@/modules/users/User.interface'
import { IProjectCommentLike } from './projectCommentLike.interface'

export interface IProjectComment {
    id?: number
    project_id?: number
    created_by?: number | IUser
    content?: string
    likes?: IProjectCommentLike[]
    created_at?: string
    updated_at?: string
}