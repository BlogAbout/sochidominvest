export interface IImage {
    name: string
    value: any
}

export interface IImageDb extends IImage {
    id: number | null
    active: number
    idObject: number
}