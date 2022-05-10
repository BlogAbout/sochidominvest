export interface IDeveloper {
    id: number | null
    name: string
    description?: string
    address: string
    phone: string
    type: string
    active: number
    author: number | null
    dateCreated?: string | null
    dateUpdate?: string | null
    avatarId?: number | null
    avatar?: string | null
    buildings?: number[]
}