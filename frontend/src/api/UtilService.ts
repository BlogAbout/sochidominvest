import {AxiosResponse} from 'axios'
import API from '../axios.init'

export default class UtilService {
    static async updateViews(objectType: string, objectId: number): Promise<AxiosResponse> {
        return API.get(`/views/${objectType}/${objectId}`)
    }
}