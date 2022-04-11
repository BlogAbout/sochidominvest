import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IAttachment} from '../@types/IAttachment'
import {IFilter} from '../@types/IFilter'

export default class AttachmentService {
    static async fetchAttachmentById(attachmentId: number): Promise<AxiosResponse> {
        return API.get(`/attachment/${attachmentId}`)
    }

    static async fetchAttachments(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/attachment', {params: filter})
    }

    static async updateAttachment(attachment: IAttachment): Promise<AxiosResponse> {
        return API.put(`/attachment/${attachment.id}`, attachment)
    }

    static async removeAttachment(attachmentId: number): Promise<AxiosResponse> {
        return API.delete(`/attachment/${attachmentId}`)
    }

    static async uploadAttachment(file: any, type: 'image' | 'video' | 'document', onUploadProgress: any): Promise<AxiosResponse> {
        let formData = new FormData()

        formData.append('file', file)
        formData.append('type', type)

        return API.post('/attachment', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress
        })
    }
}