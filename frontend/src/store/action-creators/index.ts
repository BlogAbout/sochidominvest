import {UserActionCreators} from './userActionCreators'
import {BuildingActionCreators} from './buildingActionCreators'
import {TagActionCreators} from './tagActionCreators'
import {DeveloperActionCreators} from './developerActionCreators'
import {DocumentActionCreators} from './documentActionCreators'
import {ArticleActionCreators} from './articleActionCreators'
import {NotificationActionCreators} from './notificationActionCreators'
import {CompilationActionCreators} from './compilationActionCreators'
import {AdministrationActionCreators} from './administrationActionCreators'
import {WidgetActionCreators} from './widgetActionCreators'
import {PartnerActionCreators} from './partnerActionCreators'
import {QuestionActionCreators} from './questionActionCreators'

export default {
    ...UserActionCreators,
    ...BuildingActionCreators,
    ...TagActionCreators,
    ...DeveloperActionCreators,
    ...DocumentActionCreators,
    ...ArticleActionCreators,
    ...NotificationActionCreators,
    ...CompilationActionCreators,
    ...AdministrationActionCreators,
    ...WidgetActionCreators,
    ...PartnerActionCreators,
    ...QuestionActionCreators
}