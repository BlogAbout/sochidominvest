import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IMailing, IMailingRecipient} from '../@types/IMailing'
import {IFilter} from '../@types/IFilter'

export default class FeedService {
    static async fetchMailingById(mailingId: number): Promise<AxiosResponse> {
        return API.get(`/mailing/${mailingId}/info`)
    }

    static async fetchMailings(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/mailing', {params: filter})
    }

    static async saveMailing(mailing: IMailing): Promise<AxiosResponse> {
        if (mailing.id) {
            return API.put(`/mailing/${mailing.id}`, mailing)
        } else {
            return API.post('/mailing', mailing)
        }
    }

    static async removeMailing(mailingId: number): Promise<AxiosResponse> {
        return API.delete(`/mailing/${mailingId}`)
    }

    static async removeMailingRecipient(recipient: IMailingRecipient): Promise<AxiosResponse> {
        return API.delete(`/mailing/${recipient.mailingId}/${recipient.userType}/${recipient.userId}`)
    }
}