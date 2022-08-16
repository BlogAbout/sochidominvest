import {
    BusinessProcessAction,
    BusinessProcessActionTypes,
    BusinessProcessState
} from '../../@types/businessProcessTypes'

const initialState: BusinessProcessState = {
    businessProcesses: [],
    ordering: [],
    fetching: false,
    error: ''
}

export default function BusinessProcessReducer(state: BusinessProcessState = initialState, action: BusinessProcessAction): BusinessProcessState {
    switch (action.type) {
        case BusinessProcessActionTypes.BUSINESS_PROCESS_FETCH_LIST:
            return {
                ...state,
                businessProcesses: action.payload.list,
                ordering: action.payload.ordering,
                fetching: false
            }
        case BusinessProcessActionTypes.BUSINESS_PROCESS_IS_FETCHING:
            return {...state, fetching: false}
        case BusinessProcessActionTypes.BUSINESS_PROCESS_ERROR:
            return {...state, error: action.payload, fetching: false}
        default:
            return state
    }
}