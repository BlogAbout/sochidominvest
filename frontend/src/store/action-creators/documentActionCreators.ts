import {DocumentAction, DocumentActionTypes} from '../../@types/documentTypes'
import {IDocument} from '../../@types/IDocument'
import {IFilter} from '../../@types/IFilter'
import {AppDispatch} from '../reducers'
import DocumentService from '../../api/DocumentService'

export const DocumentActionCreators = {
    setDocuments: (documents: IDocument[]): DocumentAction => ({
        type: DocumentActionTypes.DOCUMENT_FETCH_LIST,
        payload: documents
    }),
    setFetching: (payload: boolean): DocumentAction => ({
        type: DocumentActionTypes.DOCUMENT_IS_FETCHING,
        payload
    }),
    setError: (payload: string): DocumentAction => ({
        type: DocumentActionTypes.DOCUMENT_ERROR,
        payload
    }),
    fetchDocumentList: (filter: IFilter) => async (dispatch: AppDispatch) => {
        dispatch(DocumentActionCreators.setFetching(true))

        try {
            const response = await DocumentService.fetchDocuments(filter)

            if (response.status === 200) {
                dispatch(DocumentActionCreators.setDocuments(response.data))
            } else {
                dispatch(DocumentActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(DocumentActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.error('Непредвиденная ошибка загрузки данных', e)
        }
    }
}