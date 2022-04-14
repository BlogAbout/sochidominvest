import {AxiosResponse} from 'axios'
import API from '../axios.init'

export default class ArticleService {
    static async fetchFavorites(): Promise<AxiosResponse> {
        return API.get('/favorite')
    }

    static async addFavorite(buildingId: number): Promise<AxiosResponse> {
        return API.post('/favorite', {buildingId: buildingId})
    }

    static async removeFavorite(buildingId: number): Promise<AxiosResponse> {
        return API.delete(`/favorite/${buildingId}`)
    }
}