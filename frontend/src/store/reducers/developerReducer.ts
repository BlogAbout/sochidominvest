import {DeveloperAction, DeveloperActionTypes, DeveloperState} from '../../@types/developerTypes'

const initialState: DeveloperState = {
    developers: [],
    fetching: false,
    error: ''
}

export default function DeveloperReducer(state: DeveloperState = initialState, action: DeveloperAction): DeveloperState {
    switch (action.type) {
        case DeveloperActionTypes.DEVELOPER_FETCH_LIST:
            return {...state, developers: action.payload, fetching: false}
        case DeveloperActionTypes.DEVELOPER_IS_FETCHING:
            return {...state, fetching: false}
        case DeveloperActionTypes.DEVELOPER_ERROR:
            return {...state, error: action.payload, fetching: false}
        default:
            return state
    }
}