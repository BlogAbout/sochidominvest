import {IArticle} from './IArticle'

export interface ArticleState {
    articles: IArticle[]
    fetching: boolean
    error: string
}

export enum ArticleActionTypes {
    ARTICLE_FETCH_LIST = 'ARTICLE_FETCH_LIST',
    ARTICLE_IS_FETCHING = 'ARTICLE_IS_FETCHING',
    ARTICLE_ERROR = 'ARTICLE_ERROR'
}

interface ArticleFetchListAction {
    type: ArticleActionTypes.ARTICLE_FETCH_LIST
    payload: IArticle[]
}

export interface ArticleIsFetchingAction {
    type: ArticleActionTypes.ARTICLE_IS_FETCHING
    payload: boolean
}

export interface ArticleErrorAction {
    type: ArticleActionTypes.ARTICLE_ERROR
    payload: string
}

export type ArticleAction = ArticleFetchListAction | ArticleIsFetchingAction | ArticleErrorAction