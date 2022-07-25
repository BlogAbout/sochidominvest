export interface IMessenger {
    id: number | null
    author: number | null
    avatarId?: number | null
    name: string
    type: string
    dateCreated?: string | null
    members: IMessengerMember[]
    messages: IMessage[]
}

export interface IMessage {
    id: number | null
    messengerId: number | null
    active: number
    type: 'welcome' | 'online' | 'notification' | 'message' | 'create' | 'read'
    text: string
    author: number | null
    userId?: number | null
    dateCreated?: string | null
    dateUpdate?: string | null
    parentMessageId: number | null
    attendees: number[]
}

export interface IMessengerMember {
    userId: number
    readed: number | null
    deleted: number | null
    active: number
}