import {IDeveloper} from './IDeveloper'

export interface DeveloperState {
    developers: IDeveloper[]
    fetching: boolean
    error: string
}

export enum DeveloperActionTypes {
    DEVELOPER_FETCH_LIST = 'DEVELOPER_FETCH_LIST',
    DEVELOPER_IS_FETCHING = 'DEVELOPER_IS_FETCHING',
    DEVELOPER_ERROR = 'DEVELOPER_ERROR'
}

interface DeveloperFetchListAction {
    type: DeveloperActionTypes.DEVELOPER_FETCH_LIST
    payload: IDeveloper[]
}

export interface DeveloperIsFetchingAction {
    type: DeveloperActionTypes.DEVELOPER_IS_FETCHING
    payload: boolean
}

export interface DeveloperErrorAction {
    type: DeveloperActionTypes.DEVELOPER_ERROR
    payload: string
}

export type DeveloperAction = DeveloperFetchListAction | DeveloperIsFetchingAction | DeveloperErrorAction