export interface IPost {
    id: number | null
    postId: number | null
    name: string
    description: string
    author: number | null
    type: string
    dateCreated?: string | null
    dateUpdate?: string | null
    active: number
    authorName?: string | null
    hasChild?: boolean
    isOpen?: boolean
    spaces?: number
}