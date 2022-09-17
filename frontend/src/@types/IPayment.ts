export interface IPayment {
    id: number | null
    name: string
    dateCreated?: string | null
    dateUpdate?: string | null
    datePaid?: string | null
    status: string
    userId: number
    userEmail?: string
    userName?: string
    companyEmail?: string
    cost: number
    objectId: number
    objectType: string
}