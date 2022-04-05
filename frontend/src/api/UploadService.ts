import {AxiosResponse} from 'axios'
import API from '../axios.init'

export default class UploadService {
    static async uploadFile(file: any, type: string, onUploadProgress: any, objectType?: string, objectId?: number): Promise<AxiosResponse> {
        let formData = new FormData()
        formData.append('file', file)
        formData.append('type', type)

        if (objectType) {
            formData.append('objectType', objectType)
        }

        if (objectId) {
            formData.append('objectId', objectId.toString())
        }

        return API.post('/upload-file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress
        })
    }
}