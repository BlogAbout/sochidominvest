import {UserActionCreators} from './userActionCreators'
import {BuildingActionCreators} from './buildingActionCreators'
import {TagActionCreators} from './tagActionCreators'
import {DeveloperActionCreators} from './developerActionCreators'

export default {
    ...UserActionCreators,
    ...BuildingActionCreators,
    ...TagActionCreators,
    ...DeveloperActionCreators
}