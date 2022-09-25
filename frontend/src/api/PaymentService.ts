import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IPayment} from '../@types/IPayment'
import {IFilter} from '../@types/IFilter'

export default class PaymentService {
    static async fetchPaymentById(paymentId: number): Promise<AxiosResponse> {
        return API.get(`/payment/${paymentId}/info`)
    }

    static async fetchPayments(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/payment', {params: filter})
    }

    static async savePayment(payment: IPayment, sendLink: boolean): Promise<AxiosResponse> {
        if (payment.id) {
            return API.put(`/payment/${payment.id}`, {payment: payment, sendLink: sendLink})
        } else {
            return API.post('/payment', {payment: payment, sendLink: sendLink})
        }
    }

    static async fetchLinkPayment(paymentId: number): Promise<AxiosResponse> {
        return API.get(`/payment/${paymentId}/link`)
    }
}