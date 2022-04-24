import {ICompilation} from './ICompilation'

export interface CompilationState {
    compilations: ICompilation[]
    fetching: boolean
    error: string
}

export enum CompilationActionTypes {
    COMPILATION_FETCH_LIST = 'COMPILATION_FETCH_LIST',
    COMPILATION_IS_FETCHING = 'COMPILATION_IS_FETCHING',
    COMPILATION_ERROR = 'COMPILATION_ERROR'
}

interface CompilationFetchListAction {
    type: CompilationActionTypes.COMPILATION_FETCH_LIST
    payload: ICompilation[]
}

export interface CompilationIsFetchingAction {
    type: CompilationActionTypes.COMPILATION_IS_FETCHING
    payload: boolean
}

export interface CompilationErrorAction {
    type: CompilationActionTypes.COMPILATION_ERROR
    payload: string
}

export type CompilationAction = CompilationFetchListAction | CompilationIsFetchingAction | CompilationErrorAction