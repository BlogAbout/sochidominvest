import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {INotification} from '../@types/INotification'

export default class NotificationService {
    static async fetchCountNewNotifications(): Promise<AxiosResponse> {
        return API.get(`/notification/count`)
    }

    static async fetchNotificationById(notificationId: number): Promise<AxiosResponse> {
        return API.get(`/notification/${notificationId}/info`)
    }

    static async fetchNotifications(): Promise<AxiosResponse> {
        return API.get('/notification')
    }

    static async saveNotification(notification: INotification): Promise<AxiosResponse> {
        return API.post('/notification', notification)
    }

    static async removeNotification(notificationId: number): Promise<AxiosResponse> {
        return API.delete(`/notification/${notificationId}`)
    }

    static async readNotification(notificationId: number): Promise<AxiosResponse> {
        return API.get(`/notification/${notificationId}/read`)
    }

    static async readNotificationAll(): Promise<AxiosResponse> {
        return API.get(`/notification/read/`)
    }
}