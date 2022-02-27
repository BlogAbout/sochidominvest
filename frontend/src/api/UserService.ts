import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IUser} from '../@types/IUser'

export default class AuthService {
    static async fetchUserById(userId: number): Promise<AxiosResponse> {
        return API.get(`/user/${userId}`)
    }

    static async fetchUsers(): Promise<AxiosResponse> {
        return API.get('/user')
    }

    static async createUser(user: IUser): Promise<AxiosResponse> {
        return API.post('/user', user)
    }

    static async updateUser(user: IUser): Promise<AxiosResponse> {
        return API.put(`/user/${user.id}`, user)
    }

    static async removeUser(userId: number): Promise<AxiosResponse> {
        return API.delete(`/user/${userId}`)
    }
}