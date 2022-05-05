import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IPartner} from '../@types/IPartner'
import {IFilter} from '../@types/IFilter'

export default class PartnerService {
    static async fetchPartnerById(partnerId: number): Promise<AxiosResponse> {
        return API.get(`/partner/${partnerId}`)
    }

    static async fetchPartners(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/partner', {params: filter})
    }

    static async savePartner(partner: IPartner): Promise<AxiosResponse> {
        if (partner.id) {
            return API.put(`/partner/${partner.id}`, partner)
        } else {
            return API.post('/partner', partner)
        }
    }

    static async removePartner(partnerId: number): Promise<AxiosResponse> {
        return API.delete(`/partner/${partnerId}`)
    }
}