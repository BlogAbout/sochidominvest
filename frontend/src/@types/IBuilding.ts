export interface IBuilding {
    id: number | null
    name: string
    description?: string
    address: string | null
    coordinates: string | null
    type: 'building' | 'apartment' | 'house' | 'land' | 'commerce' | 'garage'
    status: string | null
    active: number
    publish: number
    rent: number
    author: number | null
    dateCreated?: string | null
    dateUpdate?: string | null
    areaMin?: number | null
    areaMax?: number | null
    costMin?: number | null
    costMax?: number | null
    costMinUnit?: number | null
    area?: number | null
    cost?: number | null
    costOld?: number | null
    countCheckers?: number | null
    tags: number[]
    contactUsers: number[]
    contactContacts: number[]
    developers: number[]
    agents: number[]
    articles: number[]
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
    images: number[]
    videos: number[]
    metaTitle?: string | null
    metaDescription?: string | null
    passed?: IBuildingPassed
    views?: number
    avatarId?: number | null
    avatar?: string | null,
    authorName?: string | null
    rentData?: IBuildingRent,
    cadastrNumber?: string | null,
    cadastrCost?: number | null
}

export interface IBuildingPassed {
    is: number | null
    quarter: number | null
    year: number | null
}

export interface IBuildingChecker {
    id: number | null
    buildingId: number | null
    name: string
    area: number | null
    cost: number | null
    costOld: number | null
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

export interface IBuildingRent {
    description: string
    type: string
    deposit: number
    commission: number
    cost?: number | null
    costDeposit?: number | null
    costCommission?: number | null
}