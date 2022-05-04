import {WidgetAction, WidgetActionTypes, WidgetState} from '../../@types/widgetTypes'

const initialState: WidgetState = {
    widgets: [],
    fetching: false,
    error: ''
}

export default function WidgetReducer(state: WidgetState = initialState, action: WidgetAction): WidgetState {
    switch (action.type) {
        case WidgetActionTypes.WIDGET_FETCH_LIST:
            return {...state, widgets: action.payload, fetching: false}
        case WidgetActionTypes.WIDGET_IS_FETCHING:
            return {...state, fetching: false}
        case WidgetActionTypes.WIDGET_ERROR:
            return {...state, error: action.payload, fetching: false}
        default:
            return state
    }
}