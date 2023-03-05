import {ICategory, IProduct} from './IStore'

export interface StoreState {
    categories: ICategory[]
    products: IProduct[]
    fetching: boolean
    error: string
}

export enum StoreActionTypes {
    CATEGORY_FETCH_LIST = 'CATEGORY_FETCH_LIST',
    PRODUCT_FETCH_LIST = 'PRODUCT_FETCH_LIST',
    STORE_IS_FETCHING = 'STORE_IS_FETCHING',
    STORE_ERROR = 'STORE_ERROR'
}

interface CategoryFetchListAction {
    type: StoreActionTypes.CATEGORY_FETCH_LIST
    payload: ICategory[]
}

interface ProductFetchListAction {
    type: StoreActionTypes.PRODUCT_FETCH_LIST
    payload: IProduct[]
}

export interface StoreIsFetchingAction {
    type: StoreActionTypes.STORE_IS_FETCHING
    payload: boolean
}

export interface StoreErrorAction {
    type: StoreActionTypes.STORE_ERROR
    payload: string
}

export type StoreAction = CategoryFetchListAction | ProductFetchListAction | StoreIsFetchingAction | StoreErrorAction