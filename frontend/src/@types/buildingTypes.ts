import {IBuilding} from './IBuilding'

export interface BuildingState {
    buildings: IBuilding[]
    fetching: boolean
    error: string
}

export enum BuildingActionTypes {
    BUILDING_FETCH_LIST = 'BUILDING_FETCH_LIST',
    BUILDING_IS_FETCHING = 'BUILDING_IS_FETCHING',
    BUILDING_ERROR = 'BUILDING_ERROR'
}

interface BuildingFetchListAction {
    type: BuildingActionTypes.BUILDING_FETCH_LIST
    payload: IBuilding[]
}

export interface BuildingIsFetchingAction {
    type: BuildingActionTypes.BUILDING_IS_FETCHING
    payload: boolean
}

export interface BuildingErrorAction {
    type: BuildingActionTypes.BUILDING_ERROR
    payload: string
}

export type BuildingAction = BuildingFetchListAction | BuildingIsFetchingAction | BuildingErrorAction