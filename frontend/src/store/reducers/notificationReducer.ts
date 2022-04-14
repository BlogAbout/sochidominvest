import {NotificationAction, NotificationActionTypes, NotificationState} from '../../@types/notificationTypes'

const initialState: NotificationState = {
    notifications: [],
    fetching: false,
    error: ''
}

export default function NotificationReducer(state: NotificationState = initialState, action: NotificationAction): NotificationState {
    switch (action.type) {
        case NotificationActionTypes.NOTIFICATION_FETCH_LIST:
            return {...state, notifications: action.payload, fetching: false}
        case NotificationActionTypes.NOTIFICATION_IS_FETCHING:
            return {...state, fetching: false}
        case NotificationActionTypes.NOTIFICATION_ERROR:
            return {...state, error: action.payload, fetching: false}
        default:
            return state
    }
}