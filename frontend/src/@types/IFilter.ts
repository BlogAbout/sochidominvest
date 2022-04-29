import {ISelector} from './ISelector'

export interface IFilter {
    id?: number[]
    active?: number[]
    publish?: number
    buildingId?: number
    objectId?: number[]
    objectType?: string
    author?: number[]
    userId?: number[]
    type?: string
}

export interface IFilterContent {
    title: string
    type: 'selector' | 'checker'
    multi: boolean
    items: ISelector[]
    selected: string[]
    onSelect(values: string[]): void
}