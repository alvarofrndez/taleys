import { IProjectMember } from '@/modules/projectMembers/projectMember.interface'
import { IProjectImage } from '@/modules/projectImages/projectImage.interface'
import { IProjectCategory } from '@/modules/projectCategories/projectCategory.interface'
import { IProjectVideo } from '@/modules/projectVideos/projectVideo.interface'
import { IProjectSite } from '@/modules/projectSites/projectSite.interface'
import { IProjectTag } from '@/modules/projectTags/projectTag.interface'
import { IUser } from '@/modules/users/User.interface'
import { IProjectComment } from '@/modules/projectComments/projectComment.interface'
import { IProjectLike } from './projectLike.interface'
import { IUniverse } from '@/modules/universes/universe.interface'

export interface IProject {
    id?: number
    created_by?: number | IUser
    name?: string
    description?: string
    visibility?: string
    permit_comments?: boolean
    atribution?: boolean
    images?: IProjectImage[]
    members?: IProjectMember[]
    videos?: IProjectVideo[]
    colaborators?: any[]
    sites?: IProjectSite[]
    tags?: IProjectTag[]
    categories?: IProjectCategory[]
    comments?: IProjectComment[]
    comments_count?: number
    likes?: IProjectLike[]
    likes_count?: number
    saves?: IProjectLike[]
    saves_count?: number
    universes?: IUniverse[]
}