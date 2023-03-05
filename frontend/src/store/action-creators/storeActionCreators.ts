import {StoreAction, StoreActionTypes} from '../../@types/storeTypes'
import {ICategory, IProduct} from '../../@types/IStore'
import {IFilter} from '../../@types/IFilter'
import {AppDispatch} from '../reducers'
import StoreService from '../../api/StoreService'

export const StoreActionCreators = {
    setCategories: (categories: ICategory[]): StoreAction => ({
        type: StoreActionTypes.CATEGORY_FETCH_LIST,
        payload: categories
    }),
    setProducts: (products: IProduct[]): StoreAction => ({
        type: StoreActionTypes.PRODUCT_FETCH_LIST,
        payload: products
    }),
    setFetching: (payload: boolean): StoreAction => ({
        type: StoreActionTypes.STORE_IS_FETCHING,
        payload
    }),
    setError: (payload: string): StoreAction => ({
        type: StoreActionTypes.STORE_ERROR,
        payload
    }),
    fetchCategoryList: (filter: IFilter) => async (dispatch: AppDispatch) => {
        dispatch(StoreActionCreators.setFetching(true))

        try {
            const response = await StoreService.fetchCategories(filter)

            if (response.status === 200) {
                dispatch(StoreActionCreators.setCategories(response.data))
            } else {
                dispatch(StoreActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(StoreActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.error('Непредвиденная ошибка загрузки данных', e)
        }
    },
    fetchProductList: (filter: IFilter) => async (dispatch: AppDispatch) => {
        dispatch(StoreActionCreators.setFetching(true))

        try {
            const response = await StoreService.fetchProducts(filter)

            if (response.status === 200) {
                dispatch(StoreActionCreators.setProducts(response.data))
            } else {
                dispatch(StoreActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(StoreActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.error('Непредвиденная ошибка загрузки данных', e)
        }
    }
}