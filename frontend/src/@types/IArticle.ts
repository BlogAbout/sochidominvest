import {IImage, IImageDb} from './IImage'

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
    images: IImageDb[]
    newImages: IImage[]
    views?: number
}