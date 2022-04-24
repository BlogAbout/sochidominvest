export interface ICompilation {
    id: number | null
    author: number | null
    name: string
    description: string
    dateCreated?: string | null
    dateUpdate?: string | null
    active: number
    buildings?: number[]
}