import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IAuth} from '../@types/IAuth'
import {ISignUp} from '../@types/ISignUp'

export default class AuthService {
    static async authUser(auth: IAuth): Promise<AxiosResponse<any>> {
        return API.post('/auth', auth)
    }

    static async registrationUser(signUp: ISignUp): Promise<AxiosResponse<any>> {
        return API.post('/registration', signUp)
    }
}