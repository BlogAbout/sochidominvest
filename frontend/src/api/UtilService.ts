import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IFilter} from '../@types/IFilter'

export default class UtilService {
    static async updateViews(objectType: string, objectId: number): Promise<AxiosResponse> {
        return API.get(`/views/${objectType}/${objectId}`)
    }

    static async fetchLogs(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/log', {params: filter})
    }
}