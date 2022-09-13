import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IPayment} from '../@types/IPayment'
import {IFilter} from '../@types/IFilter'

export default class PaymentService {
    static async fetchPaymentById(paymentId: number): Promise<AxiosResponse> {
        return API.get(`/payment/${paymentId}`)
    }

    static async fetchPayments(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/payment', {params: filter})
    }

    static async savePayment(payment: IPayment): Promise<AxiosResponse> {
        if (payment.id) {
            return API.put(`/payment/${payment.id}`, payment)
        } else {
            return API.post('/payment', payment)
        }
    }
}