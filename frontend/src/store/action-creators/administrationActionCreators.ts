import {AdministrationAction, AdministrationActionTypes} from '../../@types/administrationTypes'
import {ISetting} from '../../@types/ISetting'
import {AppDispatch} from '../reducers'
import AdministrationService from '../../api/AdministrationService'

export const AdministrationActionCreators = {
    setSettings: (settings: ISetting): AdministrationAction => ({
        type: AdministrationActionTypes.SETTING_FETCH_LIST,
        payload: settings
    }),
    setFetching: (payload: boolean): AdministrationAction => ({
        type: AdministrationActionTypes.ADMINISTRATION_IS_FETCHING,
        payload
    }),
    setError: (payload: string): AdministrationAction => ({
        type: AdministrationActionTypes.ADMINISTRATION_ERROR,
        payload
    }),
    fetchSettings: () => async (dispatch: AppDispatch) => {
        dispatch(AdministrationActionCreators.setFetching(true))

        try {
            const response = await AdministrationService.fetchSettings()

            if (response.status === 200) {
                dispatch(AdministrationActionCreators.setSettings(response.data))
            } else {
                dispatch(AdministrationActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(AdministrationActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.error('Непредвиденная ошибка загрузки данных', e)
        }
    },
    saveSetting: (settings: ISetting) => async (dispatch: AppDispatch) => {
        dispatch(AdministrationActionCreators.setFetching(true))

        try {
            const response = await AdministrationService.saveSetting(settings)

            if (response.status === 200) {
                dispatch(AdministrationActionCreators.setSettings(response.data))
            } else {
                dispatch(AdministrationActionCreators.setError('Ошибка обновления данных'))
            }
        } catch (e) {
            dispatch(AdministrationActionCreators.setError('Непредвиденная ошибка обновления данных'))
            console.error('Непредвиденная ошибка обновления данных', e)
        }
    }
}