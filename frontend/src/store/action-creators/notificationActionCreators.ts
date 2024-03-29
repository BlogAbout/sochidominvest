import {NotificationAction, NotificationActionTypes} from '../../@types/notificationTypes'
import {INotification} from '../../@types/INotification'
import {AppDispatch} from '../reducers'
import NotificationService from '../../api/NotificationService'

export const NotificationActionCreators = {
    setNotifications: (notifications: INotification[]): NotificationAction => ({
        type: NotificationActionTypes.NOTIFICATION_FETCH_LIST,
        payload: notifications
    }),
    setFetching: (payload: boolean): NotificationAction => ({
        type: NotificationActionTypes.NOTIFICATION_IS_FETCHING,
        payload
    }),
    setError: (payload: string): NotificationAction => ({
        type: NotificationActionTypes.NOTIFICATION_ERROR,
        payload
    }),
    fetchNotificationList: () => async (dispatch: AppDispatch) => {
        dispatch(NotificationActionCreators.setFetching(true))

        try {
            const response = await NotificationService.fetchNotifications()

            if (response.status === 200) {
                dispatch(NotificationActionCreators.setNotifications(response.data))
            } else {
                dispatch(NotificationActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(NotificationActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.error('Непредвиденная ошибка загрузки данных', e)
        }
    },
    readNotification: (notificationId: number) => async (dispatch: AppDispatch) => {
        dispatch(NotificationActionCreators.setFetching(true))

        try {
            const response = await NotificationService.readNotification(notificationId)

            if (response.status === 200) {
                dispatch(NotificationActionCreators.setNotifications(response.data))
            } else {
                dispatch(NotificationActionCreators.setError('Ошибка обновления данных'))
            }
        } catch (e) {
            dispatch(NotificationActionCreators.setError('Непредвиденная ошибка обновления данных'))
            console.error('Непредвиденная ошибка обновления данных', e)
        }
    },
    readNotificationAll: () => async (dispatch: AppDispatch) => {
        dispatch(NotificationActionCreators.setFetching(true))

        try {
            const response = await NotificationService.readNotificationAll()

            if (response.status === 200) {
                dispatch(NotificationActionCreators.setNotifications(response.data))
            } else {
                dispatch(NotificationActionCreators.setError('Ошибка обновления данных'))
            }
        } catch (e) {
            dispatch(NotificationActionCreators.setError('Непредвиденная ошибка обновления данных'))
            console.error('Непредвиденная ошибка обновления данных', e)
        }
    },
    removeNotification: (notificationId: number) => async (dispatch: AppDispatch) => {
        dispatch(NotificationActionCreators.setFetching(true))

        try {
            const response = await NotificationService.removeNotification(notificationId)

            if (response.status === 200) {
                dispatch(NotificationActionCreators.setNotifications(response.data))
            } else {
                dispatch(NotificationActionCreators.setError('Ошибка обновления данных'))
            }
        } catch (e) {
            dispatch(NotificationActionCreators.setError('Непредвиденная ошибка обновления данных'))
            console.error('Непредвиденная ошибка обновления данных', e)
        }
    }
}