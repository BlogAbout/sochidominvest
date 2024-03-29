export interface IUser {
    id: number | null
    email: string
    password: string | null
    phone: string
    firstName: string
    role: 'director' | 'administrator' | 'manager' | 'subscriber'
    active?: number
    block?: number
    lastActive?: string | null
    settings?: IUserSetting | null
    token?: string
    avatarId?: number | null
    avatar?: string | null
    post?: number | null
    postName?: string | null
    tariff: 'free' | 'base' | 'business' | 'effectivePlus'
    tariffExpired?: string | null
}

export interface IUserSetting {
    notifyEdit?: number
    notifyNewItem?: number
    notifyNewAction?: number
    soundAlert?: number
    pushNotify?: number
    pushMessenger?: number
    sendEmail?: number
}

export interface IUserExternal {
    id: number | null
    name: string
    email: string
    phone: string
    active?: number
    dateCreated?: string | null
    dateUpdate?: string | null
}