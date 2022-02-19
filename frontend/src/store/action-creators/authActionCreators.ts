import {AuthAction, AuthActionTypes} from '../../@types/authTypes'
import {IUser} from '../../@types/IUser'
import {IAuth} from '../../@types/IAuth'
import {AppDispatch} from '../reducers'
import AuthService from '../../api/AuthService'
import {ISignUp} from "../../@types/ISignUp";

export const AuthActionCreators = {
    setUser: (user: IUser): AuthAction => ({
        type: AuthActionTypes.SET_USER,
        payload: user
    }),
    setIsAuth: (auth: boolean): AuthAction => ({
        type: AuthActionTypes.SET_AUTH,
        payload: auth
    }),
    setFetching: (payload: boolean): AuthAction => ({
        type: AuthActionTypes.AUTH_IS_FETCHING,
        payload
    }),
    setError: (payload: string): AuthAction => ({
        type: AuthActionTypes.AUTH_ERROR,
        payload
    }),
    login: (auth: IAuth) => async (dispatch: AppDispatch) => {
        try {
            const response = await AuthService.authUser(auth)

            if (response.status === 201) {
                localStorage.setItem('auth', 'true')
                localStorage.setItem('id', response.data.data.data.userId)
                localStorage.setItem('token', response.data.data.data.token)
                localStorage.setItem('role', response.data.data.data.role)
                localStorage.setItem('settings', response.data.data.data.settings)

                dispatch(AuthActionCreators.setIsAuth(true))
            } else {
                dispatch(AuthActionCreators.setError('Неверные Email или пароль.'))
            }
        } catch (e: any) {
            if (e.data && e.data.errors) {
                const errorMessage: string[] = e.data.errors.map((error: any) => error.message)
                dispatch(AuthActionCreators.setError(errorMessage.join('\n')))
            } else {
                dispatch(AuthActionCreators.setError('Неверные Email или пароль.'))
            }
        }
    },
    registration: (signUp: ISignUp) => async (dispatch: AppDispatch) => {
        try {
            const response = await AuthService.registrationUser(signUp)

            if (response.status === 201) {
                localStorage.setItem('auth', 'true')
                localStorage.setItem('id', response.data.data.data.userId)
                localStorage.setItem('token', response.data.data.data.token)
                localStorage.setItem('role', response.data.data.data.role)
                localStorage.setItem('settings', response.data.data.data.settings)

                dispatch(AuthActionCreators.setIsAuth(true))
            } else {
                dispatch(AuthActionCreators.setError('Неверные логин или пароль.'))
            }
        } catch (e: any) {
            if (e.data && e.data.errors) {
                const errorMessage: string[] = e.data.errors.map((error: any) => error.message)
                dispatch(AuthActionCreators.setError(errorMessage.join('\n')))
            } else {
                dispatch(AuthActionCreators.setError('Произошла непредвиденная ошибка, попробуйте снова.'))
            }
        }
    },
    logout: () => async (dispatch: AppDispatch) => {
        localStorage.clear()

        dispatch(AuthActionCreators.setUser({} as IUser))
        dispatch(AuthActionCreators.setIsAuth(false))
    }
}