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
    duration: string | null
    objectId: number
    objectType: string
}