export interface IAgent {
    id: number | null
    name: string
    description?: string
    address: string
    phone: string
    author: number | null
    type: string
    dateCreated?: string | null
    dateUpdate?: string | null
    active: number
    avatarId?: number | null
    avatar?: string | null
    buildings?: number[]
}