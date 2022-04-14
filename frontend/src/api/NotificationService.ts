import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {INotification} from '../@types/INotification'

export default class NotificationService {
    static async fetchNotificationById(notificationId: number): Promise<AxiosResponse> {
        return API.get(`/notification/${notificationId}`)
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
        return API.post(`/notification/read/${notificationId}`)
    }

    static async readNotificationAll(): Promise<AxiosResponse> {
        return API.post(`/notification/read/`)
    }
}