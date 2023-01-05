import {RouteNames} from '../routes/routes'
import {IconProp} from '@fortawesome/fontawesome-svg-core'

export interface IMenuLink {
    route: RouteNames
    title: string
    text?: string
    icon?: IconProp
    hasRole?: ('director' | 'administrator' | 'manager' | 'subscriber')[]
    isSeparator?: boolean
    hasTariff?: ('free' | 'base' | 'business' | 'effectivePlus')[]
}

export interface ISubMenu {
    href: string
    title: string
    disabled: boolean
    icon: string
    description: string
    type: 'crm' | 'catalog'
    hasRole?: ('director' | 'administrator' | 'manager' | 'subscriber')[]
    hasTariff?: ('free' | 'base' | 'business' | 'effectivePlus')[]
}