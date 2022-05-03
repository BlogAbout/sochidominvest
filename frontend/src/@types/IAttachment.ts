export interface IAttachment {
    id: number
    author: number
    name: string
    description: string
    content: string
    type: 'image' | 'video' | 'document'
    extension: string
    dateCreated: string
    dateUpdate: string
    active: number
    poster?: number | null
    posterUrl?: string
}