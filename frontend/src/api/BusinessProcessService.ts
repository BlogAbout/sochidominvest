import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IBusinessProcess} from '../@types/IBusinessProcess'
import {IFilter} from '../@types/IFilter'

export default class BusinessProcessService {
    static async fetchBusinessProcessById(businessProcessId: number): Promise<AxiosResponse> {
        return API.get(`/business-process/${businessProcessId}`)
    }

    static async fetchBusinessProcesses(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/business-process', {params: filter})
    }

    static async saveBusinessProcess(businessProcess: IBusinessProcess): Promise<AxiosResponse> {
        if (businessProcess.id) {
            return API.put(`/business-process/${businessProcess.id}`, businessProcess)
        } else {
            return API.post('/business-process', businessProcess)
        }
    }

    static async removeBusinessProcess(businessProcessId: number): Promise<AxiosResponse> {
        return API.delete(`/business-process/${businessProcessId}`)
    }
}