import {QuestionAction, QuestionActionTypes, QuestionState} from '../../@types/questionTypes'

const initialState: QuestionState = {
    questions: [],
    fetching: false,
    error: ''
}

export default function QuestionReducer(state: QuestionState = initialState, action: QuestionAction): QuestionState {
    switch (action.type) {
        case QuestionActionTypes.QUESTION_FETCH_LIST:
            return {...state, questions: action.payload, fetching: false}
        case QuestionActionTypes.QUESTION_IS_FETCHING:
            return {...state, fetching: false}
        case QuestionActionTypes.QUESTION_ERROR:
            return {...state, error: action.payload, fetching: false}
        default:
            return state
    }
}