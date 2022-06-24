import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IUser} from '../@types/IUser'
import {IAuth} from '../@types/IAuth'
import {ISignUp} from '../@types/ISignUp'
import {IFilter} from '../@types/IFilter'

export default class UserService {
    static async authUser(auth: IAuth): Promise<AxiosResponse<any>> {
        return API.post('/auth', auth)
    }

    static async registrationUser(signUp: ISignUp): Promise<AxiosResponse<any>> {
        return API.post('/registration', signUp)
    }

    static async forgotPasswordUser(email: string): Promise<AxiosResponse<any>> {
        return API.post('/forgot', {email: email})
    }

    static async resetPasswordUser(email: string, password: string): Promise<AxiosResponse<any>> {
        return API.post('/reset', {email: email, password: password})
    }

    static async fetchUserById(userId: number): Promise<AxiosResponse> {
        return API.get(`/user/${userId}`)
    }

    static async fetchUsers(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/user', {params: filter})
    }

    static async saveUser(user: IUser): Promise<AxiosResponse> {
        if (user.id) {
            return API.put(`/user/${user.id}`, user)
        } else {
            return API.post('/user', user)
        }
    }

    static async removeUser(userId: number): Promise<AxiosResponse> {
        return API.delete(`/user/${userId}`)
    }
}