export interface IArticle {
    id: number | null
    name: string
    description: string
    author: number | null
    type: string
    dateCreated?: string | null
    dateUpdate?: string | null
    active: number
    publish: number
    metaTitle?: string | null
    metaDescription?: string | null
    buildings: number[]
    images: number[]
    views?: number
    avatarId?: number | null
    avatar?: string | null
    authorName?: string | null
}