import {IBusinessProcess} from './IBusinessProcess'

export interface BusinessProcessState {
    businessProcesses: IBusinessProcess[]
    fetching: boolean
    error: string
}

export enum BusinessProcessActionTypes {
    BUSINESS_PROCESS_FETCH_LIST = 'BUSINESS_PROCESS_FETCH_LIST',
    BUSINESS_PROCESS_IS_FETCHING = 'BUSINESS_PROCESS_IS_FETCHING',
    BUSINESS_PROCESS_ERROR = 'BUSINESS_PROCESS_ERROR'
}

interface BusinessProcessFetchListAction {
    type: BusinessProcessActionTypes.BUSINESS_PROCESS_FETCH_LIST
    payload: IBusinessProcess[]
}

export interface BusinessProcessIsFetchingAction {
    type: BusinessProcessActionTypes.BUSINESS_PROCESS_IS_FETCHING
    payload: boolean
}

export interface BusinessProcessErrorAction {
    type: BusinessProcessActionTypes.BUSINESS_PROCESS_ERROR
    payload: string
}

export type BusinessProcessAction = BusinessProcessFetchListAction | BusinessProcessIsFetchingAction | BusinessProcessErrorAction