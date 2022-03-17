import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IFeed} from '../@types/IFeed'
import {IFilter} from '../@types/IFilter'

export default class FeedService {
    static async fetchFeedById(feedId: number): Promise<AxiosResponse> {
        return API.get(`/feed/${feedId}`)
    }

    static async fetchFeeds(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/feed', {params: filter})
    }

    static async saveFeed(feed: IFeed): Promise<AxiosResponse> {
        if (feed.id) {
            return API.put(`/feed/${feed.id}`, feed)
        } else {
            return API.post('/feed', feed)
        }
    }

    static async removeFeed(feedId: number): Promise<AxiosResponse> {
        return API.delete(`/feed/${feedId}`)
    }
}