import {UserAction, UserActionTypes, UserState} from '../../@types/userTypes'

const initialState: UserState = {
    users: [],
    fetching: false,
    error: ''
}

export default function UserReducer(state: UserState = initialState, action: UserAction): UserState {
    switch (action.type) {
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