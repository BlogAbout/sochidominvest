import {QuestionAction, QuestionActionTypes} from '../../@types/questionTypes'
import {IQuestion} from '../../@types/IQuestion'
import {IFilter} from '../../@types/IFilter'
import {AppDispatch} from '../reducers'
import QuestionService from '../../api/QuestionService'

export const QuestionActionCreators = {
    setQuestions: (questions: IQuestion[]): QuestionAction => ({
        type: QuestionActionTypes.QUESTION_FETCH_LIST,
        payload: questions
    }),
    setFetching: (payload: boolean): QuestionAction => ({
        type: QuestionActionTypes.QUESTION_IS_FETCHING,
        payload
    }),
    setError: (payload: string): QuestionAction => ({
        type: QuestionActionTypes.QUESTION_ERROR,
        payload
    }),
    fetchQuestionList: (filter: IFilter) => async (dispatch: AppDispatch) => {
        dispatch(QuestionActionCreators.setFetching(true))

        try {
            const response = await QuestionService.fetchQuestions(filter)

            if (response.status === 200) {
                dispatch(QuestionActionCreators.setQuestions(response.data))
            } else {
                dispatch(QuestionActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(QuestionActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.error('Непредвиденная ошибка загрузки данных', e)
        }
    }
}