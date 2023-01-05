import {IUser, IUserExternal, IUserSetting} from './IUser'

export interface UserState {
    isAuth: boolean
    role: 'director' | 'administrator' | 'manager' | 'subscriber'
    user: IUser
    userId: number
    userSetting: IUserSetting
    usersOnline: number[]
    users: IUser[]
    externals: IUserExternal[]
    fetching: boolean
    error: string
}

export enum UserActionTypes {
    USER = 'USER',
    USER_AUTH = 'USER_AUTH',
    USER_ROLE = 'USER_ROLE',
    USER_ID = 'USER_ID',
    USER_SETTING = 'USER_SETTING',
    USER_ONLINE = 'USER_ONLINE',
    USER_FETCH_LIST = 'USER_FETCH_LIST',
    USER_EXTERNAL_FETCH_LIST = 'USER_EXTERNAL_FETCH_LIST',
    USER_IS_FETCHING = 'USER_IS_FETCHING',
    USER_ERROR = 'USER_ERROR'
}

interface UserInfoAction {
    type: UserActionTypes.USER
    payload: IUser
}

interface UserAuthAction {
    type: UserActionTypes.USER_AUTH
    payload: boolean
}

interface UserRoleAction {
    type: UserActionTypes.USER_ROLE
    payload: 'director' | 'administrator' | 'manager' | 'subscriber'
}

interface UserIdAction {
    type: UserActionTypes.USER_ID
    payload: number
}

interface UserSettingAction {
    type: UserActionTypes.USER_SETTING
    payload: IUserSetting
}

interface UserOnlineAction {
    type: UserActionTypes.USER_ONLINE
    payload: number[]
}

interface UserFetchListAction {
    type: UserActionTypes.USER_FETCH_LIST
    payload: IUser[]
}

interface UserExternalFetchListAction {
    type: UserActionTypes.USER_EXTERNAL_FETCH_LIST
    payload: IUserExternal[]
}

export interface UserIsFetchingAction {
    type: UserActionTypes.USER_IS_FETCHING
    payload: boolean
}

export interface UserErrorAction {
    type: UserActionTypes.USER_ERROR
    payload: string
}

export type UserAction =
    UserInfoAction
    | UserAuthAction
    | UserRoleAction
    | UserIdAction
    | UserSettingAction
    | UserOnlineAction
    | UserFetchListAction
    | UserExternalFetchListAction
    | UserIsFetchingAction
    | UserErrorAction