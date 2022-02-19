import {AuthAction, AuthActionTypes, AuthState} from '../../@types/authTypes'
import {IUser} from '../../@types/IUser'

const initialState: AuthState = {
    isAuth: false,
    user: {} as IUser,
    fetching: false,
    error: ''
}

export default function AuthReducer(state: AuthState = initialState, action: AuthAction): AuthState {
    switch (action.type) {
        case AuthActionTypes.SET_AUTH:
            return {...state, isAuth: action.payload, fetching: false}
        case AuthActionTypes.SET_USER:
            return {...state, user: action.payload}
        case AuthActionTypes.AUTH_IS_FETCHING:
            return {...state, fetching: false}
        case AuthActionTypes.AUTH_ERROR:
            return {...state, error: action.payload, fetching: false}
        default:
            return state
    }
}
