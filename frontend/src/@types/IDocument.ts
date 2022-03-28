export interface IDocument {
    id: number | null
    name: string
    objectId: number | null
    objectType: string | null
    type: 'file' | 'link' | 'constructor'
    extension?: string
    content: string
    active: number
}