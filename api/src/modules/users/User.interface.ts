import { IProject } from '@/modules/projects/project.interface'

export interface IUser {
    id: number
    username: string
    name: string
    email: string
    description: string
    password: string
    avatar_url?: string
    role_id: number
    follows: IUser[]
    followers: IUser[]
    projects: IProject[]
}

export interface IUserRegister {
    username: string
    name: string
    email: string
    avatar_url?: string
    password?: string
    confirm_password?: string
    provider: string
    provider_id: string | null
    type?: string
    role_id?: number
}

export interface IUserDTO {
    id: number
    username: string
    name: string
    avatar_url?: string
}