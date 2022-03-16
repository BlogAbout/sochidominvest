export interface IImage {
    name: string
    value: any
    avatar: number
}

export interface IImageDb extends IImage {
    id: number | null
    active: number
    idObject: number
}