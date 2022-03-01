import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {ITag} from '../@types/ITag'

export default class TagService {
    static async fetchTagById(tagId: number): Promise<AxiosResponse> {
        return API.get(`/tag/${tagId}`)
    }

    static async fetchTags(): Promise<AxiosResponse> {
        return API.get('/tag')
    }

    static async saveTag(tag: ITag): Promise<AxiosResponse> {
        if (tag.id) {
            return API.put(`/tag/${tag.id}`, tag)
        } else {
            return API.post('/tag', tag)
        }
    }

    static async removeTag(tagId: number): Promise<AxiosResponse> {
        return API.delete(`/tag/${tagId}`)
    }
}