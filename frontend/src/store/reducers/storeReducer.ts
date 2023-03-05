import {StoreAction, StoreActionTypes, StoreState} from '../../@types/storeTypes'

const initialState: StoreState = {
    categories: [],
    products: [],
    fetching: false,
    error: ''
}

export default function StoreReducer(state: StoreState = initialState, action: StoreAction): StoreState {
    switch (action.type) {
        case StoreActionTypes.CATEGORY_FETCH_LIST:
            return {...state, categories: action.payload, fetching: false}
        case StoreActionTypes.PRODUCT_FETCH_LIST:
            return {...state, products: action.payload, fetching: false}
        case StoreActionTypes.STORE_IS_FETCHING:
            return {...state, fetching: false}
        case StoreActionTypes.STORE_ERROR:
            return {...state, error: action.payload, fetching: false}
        default:
            return state
    }
}