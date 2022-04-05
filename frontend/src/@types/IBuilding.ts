import {IImage, IImageDb} from './IImage'

export interface IBuilding {
    id: number | null
    name: string
    description?: string
    address: string | null
    type: 'building' | 'apartment' | 'house' | 'land' | 'commerce' | 'garage'
    status: string | null
    active: number
    publish: number
    author: number | null
    dateCreated?: string | null
    dateUpdate?: string | null
    areaMin?: number | null
    areaMax?: number | null
    costMin?: number | null
    costMinUnit?: number | null
    area?: number | null
    cost?: number | null
    countCheckers?: number | null
    tags: number[]
    contacts: number[]
    developers: number[]
    articles?: number[]
    district?: string | null
    districtZone?: string | null
    houseClass?: string | null
    material?: string | null
    houseType?: string | null
    entranceHouse?: string | null
    parking?: string | null
    territory?: string | null
    ceilingHeight?: number | null
    maintenanceCost?: number | null
    distanceSea?: number | null
    gas?: string | null
    heating?: string | null
    electricity?: string | null
    sewerage?: string | null
    waterSupply?: string | null
    advantages?: string[]
    payments?: string[]
    formalization?: string[]
    amountContract?: string | null
    surchargeDoc?: number | null
    surchargeGas?: number | null
    saleNoResident?: number | null
    images: IImageDb[]
    newImages: IImage[]
    video: string
    metaTitle?: string | null
    metaDescription?: string | null
    passed?: IBuildingPassed
}

export interface IBuildingPassed {
    is: number
    quarter: number
    year: number
}

export interface IBuildingChecker {
    id: number | null
    buildingId: number | null
    name: string
    area: number | null
    cost: number | null
    furnish: string | null
    housing: number
    stage: string | null
    rooms: number | null
    active: number
    status: string | null
    dateCreated?: string | null
    dateUpdate?: string | null
}

export interface IBuildingHousing {
    [key: number]: IBuildingChecker[]
}