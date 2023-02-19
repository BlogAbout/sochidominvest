import {IconProp} from '@fortawesome/fontawesome-svg-core'
import {ISelector} from './ISelector'

export interface IFilter {
    id?: number[]
    active?: number[]
    publish?: number
    buildingId?: number[]
    objectId?: number[]
    objectType?: string
    author?: number[]
    userId?: number[]
    type?: string
    text?: string
    page?: string
    dateStart?: string
    dateFinish?: string
    status?: string[]
    rent?: number[]
    agentId?: number[]
    developerId?: number[]
}

export interface IFilterContent {
    title: string
    type: 'selector' | 'checker' | 'ranger' | 'district'
    rangerParams?: {
        suffix?: string
        step?: number,
        max?: number,
        afterComma?: number
    }
    multi: boolean
    items?: ISelector[]
    selected: string[] | any
    onSelect(values: string[] | any): void
}

export interface IFilterBase {
    key: string
    title: string
    icon: IconProp
    active: boolean
    onClick(value: string): void
}

export interface IFilterParams {
    houseClass?: string[]
    material?: string[]
    houseType?: string[]
    entranceHouse?: string[]
    parking?: string[]
    territory?: string[]
    gas?: string[]
    heating?: string[]
    electricity?: string[]
    sewerage?: string[]
    waterSupply?: string[]
}