export interface IUser {
    id: number | null
    email: string
    password: string | null
    phone: string
    firstName: string
    role: string
    active?: number
    block?: number
    lastActive?: string | null
    settings?: string | null
    token?: string
}