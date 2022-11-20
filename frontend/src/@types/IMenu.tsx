import {RouteNames} from '../routes/routes'
import {IconProp} from '@fortawesome/fontawesome-svg-core'

export interface IMenuLink {
    route: RouteNames
    title: string
    text?: string
    icon?: IconProp
    role?: string[]
}