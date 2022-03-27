import {IDocument} from './IDocument'

export interface DocumentState {
    documents: IDocument[]
    fetching: boolean
    error: string
}

export enum DocumentActionTypes {
    DOCUMENT_FETCH_LIST = 'DOCUMENT_FETCH_LIST',
    DOCUMENT_IS_FETCHING = 'DOCUMENT_IS_FETCHING',
    DOCUMENT_ERROR = 'DOCUMENT_ERROR'
}

interface DocumentFetchListAction {
    type: DocumentActionTypes.DOCUMENT_FETCH_LIST
    payload: IDocument[]
}

export interface DocumentIsFetchingAction {
    type: DocumentActionTypes.DOCUMENT_IS_FETCHING
    payload: boolean
}

export interface DocumentErrorAction {
    type: DocumentActionTypes.DOCUMENT_ERROR
    payload: string
}

export type DocumentAction = DocumentFetchListAction | DocumentIsFetchingAction | DocumentErrorAction