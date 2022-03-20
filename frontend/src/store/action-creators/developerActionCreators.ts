import {DeveloperAction, DeveloperActionTypes} from '../../@types/developerTypes'
import {IDeveloper} from '../../@types/IDeveloper'
import {IFilter} from '../../@types/IFilter'
import {AppDispatch} from '../reducers'
import DeveloperService from '../../api/DeveloperService'

export const DeveloperActionCreators = {
    setDevelopers: (developers: IDeveloper[]): DeveloperAction => ({
        type: DeveloperActionTypes.DEVELOPER_FETCH_LIST,
        payload: developers
    }),
    setFetching: (payload: boolean): DeveloperAction => ({
        type: DeveloperActionTypes.DEVELOPER_IS_FETCHING,
        payload
    }),
    setError: (payload: string): DeveloperAction => ({
        type: DeveloperActionTypes.DEVELOPER_ERROR,
        payload
    }),
    fetchDeveloperList: (filter: IFilter) => async (dispatch: AppDispatch) => {
        dispatch(DeveloperActionCreators.setFetching(true))

        try {
            const response = await DeveloperService.fetchDevelopers(filter)

            if (response.status === 200) {
                dispatch(DeveloperActionCreators.setDevelopers(response.data))
            } else {
                dispatch(DeveloperActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(DeveloperActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.log('Непредвиденная ошибка загрузки данных', e)
        }
    }
}