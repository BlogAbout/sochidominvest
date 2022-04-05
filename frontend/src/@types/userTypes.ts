import {IUser} from './IUser'

export interface UserState {
    isAuth: boolean
    role: string
    users: IUser[]
    fetching: boolean
    error: string
}

export enum UserActionTypes {
    USER_AUTH = 'USER_AUTH',
    USER_ROLE = 'USER_ROLE',
    USER_FETCH_LIST = 'USER_FETCH_LIST',
    USER_IS_FETCHING = 'USER_IS_FETCHING',
    USER_ERROR = 'USER_ERROR'
}

interface UserAuthAction {
    type: UserActionTypes.USER_AUTH
    payload: boolean
}

interface UserRoleAction {
    type: UserActionTypes.USER_ROLE
    payload: string
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

export type UserAction = UserAuthAction | UserRoleAction | UserFetchListAction | UserIsFetchingAction | UserErrorAction