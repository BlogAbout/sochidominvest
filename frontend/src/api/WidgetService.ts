import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IWidget} from '../@types/IWidget'
import {IFilter} from '../@types/IFilter'

export default class WidgetService {
    static async fetchWidgetById(widgetId: number): Promise<AxiosResponse> {
        return API.get(`/widget/${widgetId}/info`)
    }

    static async fetchWidgets(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/widget', {params: filter})
    }

    static async fetchWidgetsContent(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/widget/content', {params: filter})
    }

    static async saveWidget(widget: IWidget): Promise<AxiosResponse> {
        if (widget.id) {
            return API.put(`/widget/${widget.id}`, widget)
        } else {
            return API.post('/widget', widget)
        }
    }

    static async removeWidget(widgetId: number): Promise<AxiosResponse> {
        return API.delete(`/widget/${widgetId}`)
    }

    static async updateWidgetOrdering(ids: number[], filter: IFilter): Promise<AxiosResponse> {
        return API.post('/widget/ordering', {ids: ids, filter: filter})
    }
}