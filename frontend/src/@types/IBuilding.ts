export interface IBuilding {
    id: number | null
    name: string
    address: string | null
    area: number | null
    cost: number | null
    type: string | null
    status: string | null
    active: number
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
    checker?: IBuildingChecker[] | null
}

export interface IBuildingChecker {
    id: number | null
    buildingId: number
    name: string
    area: number | null
    cost: number | null
    furnish: string | null
    stage: number | null
    rooms: number | null
    active: number
}