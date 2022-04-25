import {ISetting} from './ISetting'

export interface AdministrationState {
    settings: ISetting
    fetching: boolean
    error: string
}

export enum AdministrationActionTypes {
    SETTING_FETCH_LIST = 'SETTING_FETCH_LIST',
    ADMINISTRATION_IS_FETCHING = 'ADMINISTRATION_IS_FETCHING',
    ADMINISTRATION_ERROR = 'ADMINISTRATION_ERROR'
}

interface SettingFetchListAction {
    type: AdministrationActionTypes.SETTING_FETCH_LIST
    payload: ISetting
}

export interface AdministrationIsFetchingAction {
    type: AdministrationActionTypes.ADMINISTRATION_IS_FETCHING
    payload: boolean
}

export interface AdministrationErrorAction {
    type: AdministrationActionTypes.ADMINISTRATION_ERROR
    payload: string
}

export type AdministrationAction = SettingFetchListAction | AdministrationIsFetchingAction | AdministrationErrorAction