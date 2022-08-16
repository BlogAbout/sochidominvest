import {BusinessProcessAction, BusinessProcessActionTypes} from '../../@types/businessProcessTypes'
import {IBusinessProcess} from '../../@types/IBusinessProcess'
import {IFilter} from '../../@types/IFilter'
import {AppDispatch} from '../reducers'
import BusinessProcessService from '../../api/BusinessProcessService'

export const BusinessProcessActionCreators = {
    setBusinessProcesses: (data: { list: IBusinessProcess[], ordering: number[] }): BusinessProcessAction => ({
        type: BusinessProcessActionTypes.BUSINESS_PROCESS_FETCH_LIST,
        payload: data
    }),
    setFetching: (payload: boolean): BusinessProcessAction => ({
        type: BusinessProcessActionTypes.BUSINESS_PROCESS_IS_FETCHING,
        payload
    }),
    setError: (payload: string): BusinessProcessAction => ({
        type: BusinessProcessActionTypes.BUSINESS_PROCESS_ERROR,
        payload
    }),
    fetchBusinessProcessList: (filter: IFilter) => async (dispatch: AppDispatch) => {
        dispatch(BusinessProcessActionCreators.setFetching(true))

        try {
            const response = await BusinessProcessService.fetchBusinessProcesses(filter)

            if (response.status === 200) {
                dispatch(BusinessProcessActionCreators.setBusinessProcesses(response.data))
            } else {
                dispatch(BusinessProcessActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(BusinessProcessActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.error('Непредвиденная ошибка загрузки данных', e)
        }
    }
}