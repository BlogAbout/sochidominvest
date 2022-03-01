import {UserAction, UserActionTypes} from '../../@types/userTypes'
import {IUser} from '../../@types/IUser'
import {AppDispatch} from '../reducers'
import UserService from '../../api/UserService'

export const UserActionCreators = {
    setIsAuth: (auth: boolean): UserAction => ({
        type: UserActionTypes.USER_AUTH,
        payload: auth
    }),
    setUsers: (users: IUser[]): UserAction => ({
        type: UserActionTypes.USER_FETCH_LIST,
        payload: users
    }),
    setFetching: (payload: boolean): UserAction => ({
        type: UserActionTypes.USER_IS_FETCHING,
        payload
    }),
    setError: (payload: string): UserAction => ({
        type: UserActionTypes.USER_ERROR,
        payload
    }),
    setUserAuth: (user: IUser) => async (dispatch: AppDispatch) => {
        localStorage.setItem('auth', 'true')
        localStorage.setItem('id', user.id ? user.id.toString() : '')
        localStorage.setItem('token', user.token || '')
        localStorage.setItem('role', user.role)
        localStorage.setItem('settings', user.settings || '')

        dispatch(UserActionCreators.setIsAuth(true))
    },
    logout: () => async (dispatch: AppDispatch) => {
        localStorage.clear()

        dispatch(UserActionCreators.setIsAuth(false))

        window.location.replace('/')
    },
    fetchUserList: () => async (dispatch: AppDispatch) => {
        dispatch(UserActionCreators.setFetching(true))

        try {
            const response = await UserService.fetchUsers()

            if (response.status === 200) {
                dispatch(UserActionCreators.setUsers(response.data))
            } else {
                dispatch(UserActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(UserActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.log('Непредвиденная ошибка загрузки данных', e)
        }
    }
}