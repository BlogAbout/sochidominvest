import {AuthActionCreators} from './authActionCreators'
import {UserActionCreators} from './userActionCreators'
import {BuildingActionCreators} from './buildingActionCreators'
import {TagActionCreators} from './tagActionCreators'

export default {
    ...AuthActionCreators,
    ...UserActionCreators,
    ...BuildingActionCreators,
    ...TagActionCreators
}