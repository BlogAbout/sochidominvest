import {TagAction, TagActionTypes, TagState} from '../../@types/tagTypes'

const initialState: TagState = {
    tags: [],
    fetching: false,
    error: ''
}

export default function TagReducer(state: TagState = initialState, action: TagAction): TagState {
    switch (action.type) {
        case TagActionTypes.TAG_FETCH_LIST:
            return {...state, tags: action.payload, fetching: false}
        case TagActionTypes.TAG_IS_FETCHING:
            return {...state, fetching: false}
        case TagActionTypes.TAG_ERROR:
            return {...state, error: action.payload, fetching: false}
        default:
            return state
    }
}