import {UserActionCreators} from './userActionCreators'
import {BuildingActionCreators} from './buildingActionCreators'
import {TagActionCreators} from './tagActionCreators'
import {DeveloperActionCreators} from './developerActionCreators'
import {DocumentActionCreators} from './documentActionCreators'

export default {
    ...UserActionCreators,
    ...BuildingActionCreators,
    ...TagActionCreators,
    ...DeveloperActionCreators,
    ...DocumentActionCreators
}