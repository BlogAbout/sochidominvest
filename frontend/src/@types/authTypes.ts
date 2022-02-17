import {IUser} from './IUser'

export interface AuthState {
    isAuth: boolean
    user: IUser
    fetching: boolean
    error: string
}

export enum AuthActionTypes {
    SET_AUTH = 'SET_AUTH',
    SET_USER = 'SET_USER',
    SET_FETCHING = 'SET_FETCHING',
    SET_ERROR = 'SET_ERROR'
}

export interface SetAuthAction {
    type: AuthActionTypes.SET_AUTH
    payload: boolean
}

export interface SetUserAction {
    type: AuthActionTypes.SET_USER
    payload: IUser
}

export interface SetFetchingAction {
    type: AuthActionTypes.SET_FETCHING
    payload: boolean
}

export interface SetErrorAction {
    type: AuthActionTypes.SET_ERROR
    payload: string
}

export type AuthAction = SetAuthAction | SetUserAction | SetFetchingAction | SetErrorAction