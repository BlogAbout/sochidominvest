import {UserActionCreators} from './userActionCreators'
import {BuildingActionCreators} from './buildingActionCreators'
import {TagActionCreators} from './tagActionCreators'

export default {
    ...UserActionCreators,
    ...BuildingActionCreators,
    ...TagActionCreators
}