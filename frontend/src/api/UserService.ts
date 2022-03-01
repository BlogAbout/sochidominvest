import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IUser} from '../@types/IUser'
import {IAuth} from '../@types/IAuth'
import {ISignUp} from '../@types/ISignUp'

export default class UserService {
    static async authUser(auth: IAuth): Promise<AxiosResponse<any>> {
        return API.post('/auth', auth)
    }

    static async registrationUser(signUp: ISignUp): Promise<AxiosResponse<any>> {
        return API.post('/registration', signUp)
    }

    static async fetchUserById(userId: number): Promise<AxiosResponse> {
        return API.get(`/user/${userId}`)
    }

    static async fetchUsers(): Promise<AxiosResponse> {
        return API.get('/user')
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