export interface IBuilding {
    id: number | null
    name: string
    description?: string
    address: string | null
    area: number | null
    cost: number | null
    type: string | null
    status: string | null
    active: number
    author: number | null
    dateCreated?: string | null
    dateUpdate?: string | null
    areaMin?: number | null
    areaMax?: number | null
    costMin?: number | null
    costMinUnit?: number | null
    countCheckers?: number | null
    tags: number[]
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
}

export interface IBuildingChecker {
    id: number | null
    buildingId: number | null
    name: string
    area: number | null
    cost: number | null
    furnish: string | null
    stage: number | null
    rooms: number | null
    active: number
    status: string | null
    dateCreated?: string | null
    dateUpdate?: string | null
}