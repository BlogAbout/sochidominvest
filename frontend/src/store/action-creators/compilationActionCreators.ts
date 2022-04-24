import {CompilationAction, CompilationActionTypes} from '../../@types/compilationTypes'
import {ICompilation} from '../../@types/ICompilation'
import {AppDispatch} from '../reducers'
import CompilationService from '../../api/CompilationService'

export const CompilationActionCreators = {
    setCompilations: (compilations: ICompilation[]): CompilationAction => ({
        type: CompilationActionTypes.COMPILATION_FETCH_LIST,
        payload: compilations
    }),
    setFetching: (payload: boolean): CompilationAction => ({
        type: CompilationActionTypes.COMPILATION_IS_FETCHING,
        payload
    }),
    setError: (payload: string): CompilationAction => ({
        type: CompilationActionTypes.COMPILATION_ERROR,
        payload
    }),
    fetchCompilationList: () => async (dispatch: AppDispatch) => {
        dispatch(CompilationActionCreators.setFetching(true))

        try {
            const response = await CompilationService.fetchCompilations()

            if (response.status === 200) {
                dispatch(CompilationActionCreators.setCompilations(response.data))
            } else {
                dispatch(CompilationActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(CompilationActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.error('Непредвиденная ошибка загрузки данных', e)
        }
    }
}