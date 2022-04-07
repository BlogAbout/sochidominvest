import {UserAction, UserActionTypes, UserState} from '../../@types/userTypes'
import {IUserSetting} from '../../@types/IUser'

const initialState: UserState = {
    isAuth: false,
    role: '',
    userId: 0,
    userSetting: {} as IUserSetting,
    users: [],
    fetching: false,
    error: ''
}

export default function UserReducer(state: UserState = initialState, action: UserAction): UserState {
    switch (action.type) {
        case UserActionTypes.USER_AUTH:
            return {...state, isAuth: action.payload, fetching: false}
        case UserActionTypes.USER_ROLE:
            return {...state, role: action.payload}
        case UserActionTypes.USER_ID:
            return {...state, userId: action.payload}
        case UserActionTypes.USER_SETTING:
            return {...state, userSetting: action.payload}
        case UserActionTypes.USER_FETCH_LIST:
            return {...state, users: action.payload, fetching: false}
        case UserActionTypes.USER_IS_FETCHING:
            return {...state, fetching: false}
        case UserActionTypes.USER_ERROR:
            return {...state, error: action.payload, fetching: false}
        default:
            return state
    }
}