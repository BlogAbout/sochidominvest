import {UserAction, UserActionTypes, UserState} from '../../@types/userTypes'

const initialState: UserState = {
    isAuth: false,
    role: '',
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