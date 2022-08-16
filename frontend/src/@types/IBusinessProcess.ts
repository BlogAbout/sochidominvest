export interface IBusinessProcess {
    id: number | null
    ticketId: number | null
    author: number | null
    responsible: number | null
    active: number
    type: string
    step: string
    name: string
    description: string
    dateCreated?: string | null
    dateUpdate?: string | null
    relations?: IBusinessProcessRelation[]
    attendees?: number[]
}

export interface IBusinessProcessRelation {
    objectId: number
    objectType: string
}

export interface IBusinessProcessStep {
    [key: string]: string
}

export interface IBusinessProcessesBySteps {
    [key: string]: IBusinessProcess[]
}