import {WidgetAction, WidgetActionTypes} from '../../@types/widgetTypes'
import {IWidget} from '../../@types/IWidget'
import {IFilter} from '../../@types/IFilter'
import {AppDispatch} from '../reducers'
import WidgetService from '../../api/WidgetService'

export const WidgetActionCreators = {
    setWidgets: (widgets: IWidget[]): WidgetAction => ({
        type: WidgetActionTypes.WIDGET_FETCH_LIST,
        payload: widgets
    }),
    setFetching: (payload: boolean): WidgetAction => ({
        type: WidgetActionTypes.WIDGET_IS_FETCHING,
        payload
    }),
    setError: (payload: string): WidgetAction => ({
        type: WidgetActionTypes.WIDGET_ERROR,
        payload
    }),
    fetchWidgetList: (filter: IFilter) => async (dispatch: AppDispatch) => {
        dispatch(WidgetActionCreators.setFetching(true))

        try {
            const response = await WidgetService.fetchWidgets(filter)

            if (response.status === 200) {
                dispatch(WidgetActionCreators.setWidgets(response.data))
            } else {
                dispatch(WidgetActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(WidgetActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.error('Непредвиденная ошибка загрузки данных', e)
        }
    }
}