export interface IArticle {
    id: number | null
    name: string
    description: string
    author: number | null
    type: 'article' | 'action' | 'news'
    dateCreated?: string | null
    dateUpdate?: string | null
    active: number
    publish: number
    metaTitle?: string | null
    metaDescription?: string | null
}