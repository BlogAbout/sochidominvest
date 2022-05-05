import {IPartner} from './IPartner'

export interface PartnerState {
    partners: IPartner[]
    fetching: boolean
    error: string
}

export enum PartnerActionTypes {
    PARTNER_FETCH_LIST = 'PARTNER_FETCH_LIST',
    PARTNER_IS_FETCHING = 'PARTNER_IS_FETCHING',
    PARTNER_ERROR = 'PARTNER_ERROR'
}

interface PartnerFetchListAction {
    type: PartnerActionTypes.PARTNER_FETCH_LIST
    payload: IPartner[]
}

export interface PartnerIsFetchingAction {
    type: PartnerActionTypes.PARTNER_IS_FETCHING
    payload: boolean
}

export interface PartnerErrorAction {
    type: PartnerActionTypes.PARTNER_ERROR
    payload: string
}

export type PartnerAction = PartnerFetchListAction | PartnerIsFetchingAction | PartnerErrorAction