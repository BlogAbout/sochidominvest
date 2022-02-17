export interface IUser {
    id: number | null
    login: string
    phone: string
    name: string
    role: string
    active?: number
    lastActive?: string | null
    settings?: string | null
}