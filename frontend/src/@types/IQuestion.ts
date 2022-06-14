export interface IQuestion {
    id: number | null
    name: string
    description: string
    author: number | null
    type: string | null
    dateCreated?: string | null
    dateUpdate?: string | null
    active: number
    authorName?: string | null
}