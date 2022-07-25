import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IFilter} from '../@types/IFilter'

export default class MessengerService {
    static async fetchMessengers(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/messenger', {params: filter})
    }

    static async fetchMessages(messengerId: number): Promise<AxiosResponse> {
        return API.get(`/messenger/${messengerId}`)
    }
}