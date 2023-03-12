export interface ICategory {
    id: number | null
    name: string
    description?: string
    dateCreated?: string
    dateUpdate?: string
    active: number
    metaTitle?: string
    metaDescription?: string
    fields: string[]
}

export interface IProduct {
    id: number | null
    categoryId: number
    name: string
    description?: string
    cost: number
    costOld?: number
    avatarId?: number | null
    avatar?: string | null
    dateCreated?: string
    dateUpdate?: string
    active: number
    author: number
    metaTitle?: string
    metaDescription?: string
    fields: { [key: string]: string | number }
    images: number[]
    videos: number[]
}