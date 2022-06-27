import {PostAction, PostActionTypes, PostState} from '../../@types/postTypes'

const initialState: PostState = {
    posts: [],
    fetching: false,
    error: ''
}

export default function PostReducer(state: PostState = initialState, action: PostAction): PostState {
    switch (action.type) {
        case PostActionTypes.POST_FETCH_LIST:
            return {...state, posts: action.payload, fetching: false}
        case PostActionTypes.POST_IS_FETCHING:
            return {...state, fetching: false}
        case PostActionTypes.POST_ERROR:
            return {...state, error: action.payload, fetching: false}
        default:
            return state
    }
}