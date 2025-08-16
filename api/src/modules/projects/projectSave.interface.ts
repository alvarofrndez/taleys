import { IUser } from '@/modules/users/User.interface'
import { IProject } from './project.interface'

export interface IProjectLike {
    project_id?: number | IProject
    user_id?: number | IUser
    created_at?: string
}