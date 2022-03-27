import {DocumentAction, DocumentActionTypes, DocumentState} from '../../@types/documentTypes'

const initialState: DocumentState = {
    documents: [],
    fetching: false,
    error: ''
}

export default function DocumentReducer(state: DocumentState = initialState, action: DocumentAction): DocumentState {
    switch (action.type) {
        case DocumentActionTypes.DOCUMENT_FETCH_LIST:
            return {...state, documents: action.payload, fetching: false}
        case DocumentActionTypes.DOCUMENT_IS_FETCHING:
            return {...state, fetching: false}
        case DocumentActionTypes.DOCUMENT_ERROR:
            return {...state, error: action.payload, fetching: false}
        default:
            return state
    }
}