import {BuildingAction, BuildingActionTypes} from '../../@types/buildingTypes'
import {IBuilding} from '../../@types/IBuilding'
import {AppDispatch} from '../reducers'
import BuildingService from '../../api/BuildingService'

export const BuildingActionCreators = {
    setBuildings: (buildings: IBuilding[]): BuildingAction => ({
        type: BuildingActionTypes.BUILDING_FETCH_LIST,
        payload: buildings
    }),
    setFetching: (payload: boolean): BuildingAction => ({
        type: BuildingActionTypes.BUILDING_IS_FETCHING,
        payload
    }),
    setError: (payload: string): BuildingAction => ({
        type: BuildingActionTypes.BUILDING_ERROR,
        payload
    }),
    fetchBuildingList: () => async (dispatch: AppDispatch) => {
        dispatch(BuildingActionCreators.setFetching(true))

        try {
            const response = await BuildingService.fetchBuildings()

            if (response.status === 200) {
                dispatch(BuildingActionCreators.setBuildings(response.data))
            } else {
                dispatch(BuildingActionCreators.setError('Ошибка загрузки данных'))
            }
        } catch (e) {
            dispatch(BuildingActionCreators.setError('Непредвиденная ошибка загрузки данных'))
            console.log('Непредвиденная ошибка загрузки данных', e)
        }
    }
}