import {IWidget} from './IWidget'

export interface WidgetState {
    widgets: IWidget[]
    fetching: boolean
    error: string
}

export enum WidgetActionTypes {
    WIDGET_FETCH_LIST = 'WIDGET_FETCH_LIST',
    WIDGET_IS_FETCHING = 'WIDGET_IS_FETCHING',
    WIDGET_ERROR = 'WIDGET_ERROR'
}

interface WidgetFetchListAction {
    type: WidgetActionTypes.WIDGET_FETCH_LIST
    payload: IWidget[]
}

export interface WidgetIsFetchingAction {
    type: WidgetActionTypes.WIDGET_IS_FETCHING
    payload: boolean
}

export interface WidgetErrorAction {
    type: WidgetActionTypes.WIDGET_ERROR
    payload: string
}

export type WidgetAction = WidgetFetchListAction | WidgetIsFetchingAction | WidgetErrorAction