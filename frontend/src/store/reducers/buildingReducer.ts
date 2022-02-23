import {BuildingAction, BuildingActionTypes, BuildingState} from '../../@types/buildingTypes'

const initialState: BuildingState = {
    buildings: [],
    fetching: false,
    error: ''
}

export default function BuildingReducer(state: BuildingState = initialState, action: BuildingAction): BuildingState {
    switch (action.type) {
        case BuildingActionTypes.BUILDING_FETCH_LIST:
            return {...state, buildings: action.payload, fetching: false}
        case BuildingActionTypes.BUILDING_IS_FETCHING:
            return {...state, fetching: false}
        case BuildingActionTypes.BUILDING_ERROR:
            return {...state, error: action.payload, fetching: false}
        default:
            return state
    }
}