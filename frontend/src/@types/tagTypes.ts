import {ITag} from './ITag'

export interface TagState {
    tags: ITag[]
    fetching: boolean
    error: string
}

export enum TagActionTypes {
    TAG_FETCH_LIST = 'TAG_FETCH_LIST',
    TAG_IS_FETCHING = 'TAG_IS_FETCHING',
    TAG_ERROR = 'TAG_ERROR'
}

interface TagFetchListAction {
    type: TagActionTypes.TAG_FETCH_LIST
    payload: ITag[]
}

export interface TagIsFetchingAction {
    type: TagActionTypes.TAG_IS_FETCHING
    payload: boolean
}

export interface TagErrorAction {
    type: TagActionTypes.TAG_ERROR
    payload: string
}

export type TagAction = TagFetchListAction | TagIsFetchingAction | TagErrorAction