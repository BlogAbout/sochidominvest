import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {ICompilation} from '../@types/ICompilation'

export default class CompilationService {
    static async fetchCompilationById(compilationId: number): Promise<AxiosResponse> {
        return API.get(`/compilation/${compilationId}`)
    }

    static async fetchCompilations(): Promise<AxiosResponse> {
        return API.get('/compilation')
    }

    static async saveCompilation(compilation: ICompilation): Promise<AxiosResponse> {
        if (compilation.id) {
            return API.put(`/compilation/${compilation.id}`, compilation)
        } else {
            return API.post('/compilation', compilation)
        }
    }

    static async removeCompilation(compilationId: number): Promise<AxiosResponse> {
        return API.delete(`/compilation/${compilationId}`)
    }

    static async addBuildingInCompilation(compilationId: number, buildingId: number, compilationOldId?: number | null): Promise<AxiosResponse> {
        if (compilationOldId) {
            return API.get(`/compilation/${compilationId}/${buildingId}/${compilationOldId}`)
        } else {
            return API.get(`/compilation/${compilationId}/${buildingId}`)
        }
    }

    static async removeBuildingFromCompilation(compilationId: number, buildingId: number): Promise<AxiosResponse> {
        return API.delete(`/compilation/${compilationId}/${buildingId}`)
    }
}