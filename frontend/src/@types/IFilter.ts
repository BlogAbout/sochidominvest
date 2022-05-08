import {IconProp} from '@fortawesome/fontawesome-svg-core'
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
    text?: string
    page?: string
}

export interface IFilterContent {
    title: string
    type: 'selector' | 'checker'
    multi: boolean
    items: ISelector[]
    selected: string[]
    onSelect(values: string[]): void
}

export interface IFilterBase {
    key: string
    title: string
    icon: IconProp
    active: boolean
    onClick(value: string): void
}