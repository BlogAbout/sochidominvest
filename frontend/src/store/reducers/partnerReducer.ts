import {PartnerAction, PartnerActionTypes, PartnerState} from '../../@types/partnerTypes'

const initialState: PartnerState = {
    partners: [],
    fetching: false,
    error: ''
}

export default function PartnerReducer(state: PartnerState = initialState, action: PartnerAction): PartnerState {
    switch (action.type) {
        case PartnerActionTypes.PARTNER_FETCH_LIST:
            return {...state, partners: action.payload, fetching: false}
        case PartnerActionTypes.PARTNER_IS_FETCHING:
            return {...state, fetching: false}
        case PartnerActionTypes.PARTNER_ERROR:
            return {...state, error: action.payload, fetching: false}
        default:
            return state
    }
}