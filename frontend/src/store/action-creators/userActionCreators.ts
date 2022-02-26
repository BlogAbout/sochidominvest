import {UserAction, UserActionTypes} from '../../@types/userTypes'
import {IUser} from '../../@types/IUser'
import {AppDispatch} from '../reducers'
import UserService from '../../api/UserService'

export const UserActionCreators = {
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
    fetchUserList: () => async (dispatch: AppDispatch) => {
        dispatch(UserActionCreators.setFetching(true))

        try {
            const response = await UserService.fetchUsers()

            if (response.status === 200) {
                dispatch(UserActionCreators.setUsers(response.data.data))
            } else {
                dispatch(UserActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(UserActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.log('Непредвиденная ошибка загрузки данных', e)
        }
    },
    saveUser: (user: IUser) => async (dispatch: AppDispatch) => {
        dispatch(UserActionCreators.setFetching(true))

        try {
            let response

            if (user.id) {
                response = await UserService.updateUser(user)
            } else {
                response = await UserService.createUser(user)
            }

            if (response.status === 200 || response.status === 201) {
                dispatch(UserActionCreators.setError(''))
            } else {
                dispatch(UserActionCreators.setError('Ошибка сохранения данных'))
            }
        } catch (e: any) {
            if (e.data && e.data.errors) {
                const errorMessage: string[] = e.data.errors.map((error: any) => error.message)
                dispatch(UserActionCreators.setError(errorMessage.join('\n')))
            } else {
                console.log('Непредвиденная ошибка сохранения данных', e)
                dispatch(UserActionCreators.setError('Непредвиденная ошибка сохранения данных'))
            }
        }
    },
    removeUser: (userId: number) => async (dispatch: AppDispatch) => {
        dispatch(UserActionCreators.setFetching(true))

        try {
            const response = await UserService.removeUser(userId)

            if (response.status === 200) {
                dispatch(UserActionCreators.setError(''))
            } else {
                dispatch(UserActionCreators.setError('Ошибка удаления данных.'))
            }
        } catch (e) {
            dispatch(UserActionCreators.setError('Непредвиденная ошибка удаления данных.'))
            console.log('Непредвиденная ошибка удаления данных.', e)
        }
    }
}