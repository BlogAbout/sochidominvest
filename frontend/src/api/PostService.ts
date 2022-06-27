import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IPost} from '../@types/IPost'
import {IFilter} from '../@types/IFilter'

export default class PostService {
    static async fetchPostById(postId: number): Promise<AxiosResponse> {
        return API.get(`/post/${postId}`)
    }

    static async fetchPosts(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/post', {params: filter})
    }

    static async savePost(post: IPost): Promise<AxiosResponse> {
        if (post.id) {
            return API.put(`/post/${post.id}`, post)
        } else {
            return API.post('/post', post)
        }
    }

    static async removePost(postId: number): Promise<AxiosResponse> {
        return API.delete(`/post/${postId}`)
    }
}