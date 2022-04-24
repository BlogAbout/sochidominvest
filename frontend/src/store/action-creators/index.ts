import {UserActionCreators} from './userActionCreators'
import {BuildingActionCreators} from './buildingActionCreators'
import {TagActionCreators} from './tagActionCreators'
import {DeveloperActionCreators} from './developerActionCreators'
import {DocumentActionCreators} from './documentActionCreators'
import {ArticleActionCreators} from './articleActionCreators'
import {NotificationActionCreators} from './notificationActionCreators'
import {CompilationActionCreators} from './compilationActionCreators'

export default {
    ...UserActionCreators,
    ...BuildingActionCreators,
    ...TagActionCreators,
    ...DeveloperActionCreators,
    ...DocumentActionCreators,
    ...ArticleActionCreators,
    ...NotificationActionCreators,
    ...CompilationActionCreators
}