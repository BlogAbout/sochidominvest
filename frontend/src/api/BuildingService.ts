import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IBuilding} from '../@types/IBuilding'

export default class BuildingService {
    static async fetchBuildingById(buildingId: number): Promise<AxiosResponse> {
        return API.get(`/building/${buildingId}`)
    }

    static async fetchBuildings(): Promise<AxiosResponse> {
        return API.get('/building')
    }

    static async createBuilding(building: IBuilding): Promise<AxiosResponse> {
        return API.post('/building', building)
    }

    static async updateBuilding(building: IBuilding): Promise<AxiosResponse> {
        return API.post(`/building/${building.id}`, building)
    }

    static async removeBuilding(buildingId: number): Promise<AxiosResponse> {
        return API.delete(`/building/${buildingId}`)
    }
}