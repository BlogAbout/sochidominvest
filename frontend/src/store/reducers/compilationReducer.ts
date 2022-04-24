import {CompilationAction, CompilationActionTypes, CompilationState} from '../../@types/compilationTypes'

const initialState: CompilationState = {
    compilations: [],
    fetching: false,
    error: ''
}

export default function CompilationReducer(state: CompilationState = initialState, action: CompilationAction): CompilationState {
    switch (action.type) {
        case CompilationActionTypes.COMPILATION_FETCH_LIST:
            return {...state, compilations: action.payload, fetching: false}
        case CompilationActionTypes.COMPILATION_IS_FETCHING:
            return {...state, fetching: false}
        case CompilationActionTypes.COMPILATION_ERROR:
            return {...state, error: action.payload, fetching: false}
        default:
            return state
    }
}