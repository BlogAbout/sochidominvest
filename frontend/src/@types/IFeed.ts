export interface IFeed {
    id: number | null
    author: number | null
    phone: string | null
    name: string | null
    title: string
    type: string
    objectId: number | null
    objectType: string | null
    active: number
    status: string
    dateCreated?: string
    dateUpdate?: string
    messages?: IFeedMessage[]
}

export interface IFeedMessage {
    id: number | null
    feedId: number | null
    author: number | null
    active: number
    status: string
    content: string
    dateCreated?: string,
    authorName?: string | null
}