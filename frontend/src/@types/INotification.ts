export interface INotification {
    id: number | null
    author?: number
    name: string
    description: string | null
    type: string
    objectId?: number | null
    objectType?: string | null
    dateCreated?: string
    active: number
    status?: string
}