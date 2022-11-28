export interface IMailing {
    id: number | null
    name: string
    content: string
    contentHtml: string
    type: string
    author: number | null
    authorName?: string | null
    dateCreated?: string | null
    active: number
    status: number
    countRecipients: number
}

export interface IMailingRecipient {
    mailingId: number
    userId: number
    userType: string
    email?: string
}