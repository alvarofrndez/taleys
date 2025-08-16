import { IUser } from '@/modules/users/User.interface'
import { IProjectComment } from './projectComment.interface'

export interface IProjectCommentLike {
    comment_id?: number | IProjectComment
    user_id?: number | IUser
    created_at?: string
}