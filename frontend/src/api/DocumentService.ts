import {AxiosResponse} from 'axios'
import API from '../axios.init'
import {IDocument} from '../@types/IDocument'
import {IFilter} from '../@types/IFilter'

export default class DocumentService {
    static async fetchDocumentById(documentId: number): Promise<AxiosResponse> {
        return API.get(`/document/${documentId}`)
    }

    static async fetchDocuments(filter: IFilter): Promise<AxiosResponse> {
        return API.get('/document', {params: filter})
    }

    static async saveDocument(document: IDocument): Promise<AxiosResponse> {
        if (document.id) {
            return API.put(`/document/${document.id}`, document)
        } else {
            return API.post('/document', document)
        }
    }

    static async removeDocument(documentId: number): Promise<AxiosResponse> {
        return API.delete(`/document/${documentId}`)
    }

    static async uploadDocument(file: any, onUploadProgress: any): Promise<AxiosResponse> {
        let formData = new FormData()
        formData.append('file', file)

        return API.post('/document-upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress
        })
    }
}