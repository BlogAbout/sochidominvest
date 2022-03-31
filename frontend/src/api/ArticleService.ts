import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IArticle} from '../@types/IArticle'
import {IFilter} from '../@types/IFilter'

export default class ArticleService {
    static async fetchArticleById(articleId: number): Promise<AxiosResponse> {
        return API.get(`/article/${articleId}`)
    }

    static async fetchArticles(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/article', {params: filter})
    }

    static async saveArticle(article: IArticle): Promise<AxiosResponse> {
        if (article.id) {
            return API.put(`/article/${article.id}`, article)
        } else {
            return API.post('/article', article)
        }
    }

    static async removeArticle(articleId: number): Promise<AxiosResponse> {
        return API.delete(`/article/${articleId}`)
    }
}