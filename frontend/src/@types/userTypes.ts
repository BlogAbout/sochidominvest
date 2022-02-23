import {IUser} from './IUser'

export interface UserState {
    users: IUser[]
    fetching: boolean
    error: string
}

export enum UserActionTypes {
    USER_FETCH_LIST = 'USER_FETCH_LIST',
    USER_IS_FETCHING = 'USER_IS_FETCHING',
    USER_ERROR = 'USER_ERROR'
}

interface UserFetchListAction {
    type: UserActionTypes.USER_FETCH_LIST
    payload: IUser[]
}

export interface UserIsFetchingAction {
    type: UserActionTypes.USER_IS_FETCHING
    payload: boolean
}

export interface UserErrorAction {
    type: UserActionTypes.USER_ERROR
    payload: string
}

export type UserAction = UserFetchListAction | UserIsFetchingAction | UserErrorAction