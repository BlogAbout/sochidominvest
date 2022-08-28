export interface IBooking {
    id: number | null
    dateStart: string
    dateFinish: string
    status: string
    buildingId: number
    buildingName: string
    userId: number
}