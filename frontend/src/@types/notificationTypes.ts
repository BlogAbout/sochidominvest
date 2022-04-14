import {INotification} from './INotification'

export interface NotificationState {
    notifications: INotification[]
    fetching: boolean
    error: string
}

export enum NotificationActionTypes {
    NOTIFICATION_FETCH_LIST = 'NOTIFICATION_FETCH_LIST',
    NOTIFICATION_IS_FETCHING = 'NOTIFICATION_IS_FETCHING',
    NOTIFICATION_ERROR = 'NOTIFICATION_ERROR'
}

interface NotificationFetchListAction {
    type: NotificationActionTypes.NOTIFICATION_FETCH_LIST
    payload: INotification[]
}

export interface NotificationIsFetchingAction {
    type: NotificationActionTypes.NOTIFICATION_IS_FETCHING
    payload: boolean
}

export interface NotificationErrorAction {
    type: NotificationActionTypes.NOTIFICATION_ERROR
    payload: string
}

export type NotificationAction = NotificationFetchListAction | NotificationIsFetchingAction | NotificationErrorAction