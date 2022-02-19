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
    AUTH_IS_FETCHING = 'AUTH_IS_FETCHING',
    AUTH_ERROR = 'AUTH_ERROR'
}

interface SetAuthAction {
    type: AuthActionTypes.SET_AUTH
    payload: boolean
}

interface SetUserAction {
    type: AuthActionTypes.SET_USER
    payload: IUser
}

interface AuthIsFetchingAction {
    type: AuthActionTypes.AUTH_IS_FETCHING
    payload: boolean
}

interface AuthErrorAction {
    type: AuthActionTypes.AUTH_ERROR
    payload: string
}

export type AuthAction = SetAuthAction | SetUserAction | AuthIsFetchingAction | AuthErrorAction