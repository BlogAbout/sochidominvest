import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {ISetting} from '../@types/ISetting'

export default class AdministrationService {
    static async fetchSettings(): Promise<AxiosResponse> {
        return API.get('/administration/setting')
    }

    static async saveSetting(setting: ISetting): Promise<AxiosResponse> {
        return API.post('/administration/setting', {settings: setting})
    }
}