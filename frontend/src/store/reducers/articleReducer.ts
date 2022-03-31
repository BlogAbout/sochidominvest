import {ArticleAction, ArticleActionTypes, ArticleState} from '../../@types/articleTypes'

const initialState: ArticleState = {
    articles: [],
    fetching: false,
    error: ''
}

export default function ArticleReducer(state: ArticleState = initialState, action: ArticleAction): ArticleState {
    switch (action.type) {
        case ArticleActionTypes.ARTICLE_FETCH_LIST:
            return {...state, articles: action.payload, fetching: false}
        case ArticleActionTypes.ARTICLE_IS_FETCHING:
            return {...state, fetching: false}
        case ArticleActionTypes.ARTICLE_ERROR:
            return {...state, error: action.payload, fetching: false}
        default:
            return state
    }
}