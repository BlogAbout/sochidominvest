import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IDeveloper} from '../@types/IDeveloper'
import {IFilter} from '../@types/IFilter'

export default class DeveloperService {
    static async fetchDeveloperById(developerId: number): Promise<AxiosResponse> {
        return API.get(`/developer/${developerId}`)
    }

    static async fetchDevelopers(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/developer', {params: filter})
    }

    static async saveDeveloper(developer: IDeveloper): Promise<AxiosResponse> {
        if (developer.id) {
            return API.put(`/developer/${developer.id}`, developer)
        } else {
            return API.post('/developer', developer)
        }
    }

    static async removeDeveloper(developerId: number): Promise<AxiosResponse> {
        return API.delete(`/developer/${developerId}`)
    }
}