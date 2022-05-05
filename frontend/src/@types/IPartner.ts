export interface IPartner {
    id: number | null
    name: string
    description: string
    subtitle: string | null
    author: number | null
    type: string
    dateCreated?: string | null
    dateUpdate?: string | null
    active: number
    metaTitle?: string | null
    metaDescription?: string | null
    avatarId?: number | null
    avatar?: string | null
    authorName?: string | null
    info?: IPartnerInfo | null
}

export interface IPartnerInfo {
    [key: string]: string
}