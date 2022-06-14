import {IQuestion} from './IQuestion'

export interface QuestionState {
    questions: IQuestion[]
    fetching: boolean
    error: string
}

export enum QuestionActionTypes {
    QUESTION_FETCH_LIST = 'QUESTION_FETCH_LIST',
    QUESTION_IS_FETCHING = 'QUESTION_IS_FETCHING',
    QUESTION_ERROR = 'QUESTION_ERROR'
}

interface QuestionFetchListAction {
    type: QuestionActionTypes.QUESTION_FETCH_LIST
    payload: IQuestion[]
}

export interface QuestionIsFetchingAction {
    type: QuestionActionTypes.QUESTION_IS_FETCHING
    payload: boolean
}

export interface QuestionErrorAction {
    type: QuestionActionTypes.QUESTION_ERROR
    payload: string
}

export type QuestionAction = QuestionFetchListAction | QuestionIsFetchingAction | QuestionErrorAction