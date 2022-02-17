import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IUser} from '../@types/IUser'

export default class AuthService {
    static async fetchUserById(userId: number): Promise<AxiosResponse<any>> {
        return API.get(`/user/${userId}`)
    }

    static async fetchUsersByFilter(filter: any): Promise<AxiosResponse<any>> {
        return API.get('/user', {params: filter})
    }

    static async updateProfile(user: IUser): Promise<AxiosResponse<any>> {
        return API.put(`/user/${user.id}`, user)
    }
}