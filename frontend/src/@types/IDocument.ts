export interface IDocument {
    id: number | null
    name: string
    attachmentId: number | null
    objectId: number | null
    objectType: string | null
    type: 'file' | 'link' | 'constructor'
    content?: string
    active: number
    url?: string
    avatarId?: number | null
    avatar?: string | null
}