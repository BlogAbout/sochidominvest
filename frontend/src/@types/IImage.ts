export interface IImage {
    name: string
    value: any
    avatar: number
    objectType: string
}

export interface IImageDb extends IImage {
    id: number | null
    active: number
    objectId: number
}