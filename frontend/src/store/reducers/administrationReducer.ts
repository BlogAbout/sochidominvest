import {AdministrationAction, AdministrationActionTypes, AdministrationState} from '../../@types/administrationTypes'
import {ISetting} from '../../@types/ISetting'

const initialState: AdministrationState = {
    settings: {} as ISetting,
    fetching: false,
    error: ''
}

export default function AdministrationReducer(state: AdministrationState = initialState, action: AdministrationAction): AdministrationState {
    switch (action.type) {
        case AdministrationActionTypes.SETTING_FETCH_LIST:
            return {...state, settings: action.payload, fetching: false}
        case AdministrationActionTypes.ADMINISTRATION_IS_FETCHING:
            return {...state, fetching: false}
        case AdministrationActionTypes.ADMINISTRATION_ERROR:
            return {...state, error: action.payload, fetching: false}
        default:
            return state
    }
}