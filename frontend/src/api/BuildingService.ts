import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IBuilding} from '../@types/IBuilding'
import {IFilter} from '../@types/IFilter'

export default class BuildingService {
    static async fetchBuildingById(buildingId: number): Promise<AxiosResponse> {
        return API.get(`/building/${buildingId}`)
    }

    static async fetchBuildings(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/building', {params: filter})
    }

    static async saveBuilding(building: IBuilding): Promise<AxiosResponse> {
        if (building.id) {
            return API.put(`/building/${building.id}`, building)
        } else {
            return API.post('/building', building)
        }
    }

    static async removeBuilding(buildingId: number): Promise<AxiosResponse> {
        return API.delete(`/building/${buildingId}`)
    }
}