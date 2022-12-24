export interface IAgent {
    id: number | null
    name: string
    description?: string
    address: string
    phone: string
    author: number | null
    authorName?: string | null
    type: string
    dateCreated?: string | null
    dateUpdate?: string | null
    active: number
    avatarId?: number | null
    avatar?: string | null
    buildings?: number[]
}

export interface IContact {
    id: number | null
    agentId: number
    name: string
    post: string
    phone: string
    author: number | null
    authorName?: string | null
    dateCreated?: string | null
    dateUpdate?: string | null
    active: number
}