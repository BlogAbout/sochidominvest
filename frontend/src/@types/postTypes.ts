import {IPost} from './IPost'

export interface PostState {
    posts: IPost[]
    fetching: boolean
    error: string
}

export enum PostActionTypes {
    POST_FETCH_LIST = 'POST_FETCH_LIST',
    POST_IS_FETCHING = 'POST_IS_FETCHING',
    POST_ERROR = 'POST_ERROR'
}

interface PostFetchListAction {
    type: PostActionTypes.POST_FETCH_LIST
    payload: IPost[]
}

export interface PostIsFetchingAction {
    type: PostActionTypes.POST_IS_FETCHING
    payload: boolean
}

export interface PostErrorAction {
    type: PostActionTypes.POST_ERROR
    payload: string
}

export type PostAction = PostFetchListAction | PostIsFetchingAction | PostErrorAction