import {applyMiddleware, combineReducers, createStore} from 'redux'
import thunk from 'redux-thunk'
import UserReducer from './userReducer'
import BuildingReducer from './buildingReducer'
import TagReducer from './tagReducer'
import DeveloperReducer from './developerReducer'
import DocumentReducer from './documentReducer'
import ArticleReducer from './articleReducer'
import NotificationReducer from './notificationReducer'
import CompilationReducer from './compilationReducer'
import AdministrationReducer from './administrationReducer'
import WidgetReducer from './widgetReducer'
import PartnerReducer from './partnerReducer'
import QuestionReducer from './questionReducer'
import PostReducer from './postReducer'
import BusinessProcessReducer from './businessProcessReducer'
import AgentReducer from './agentReducer'

const rootReducer = combineReducers({
    userReducer: UserReducer,
    buildingReducer: BuildingReducer,
    tagReducer: TagReducer,
    developerReducer: DeveloperReducer,
    documentReducer: DocumentReducer,
    articleReducer: ArticleReducer,
    notificationReducer: NotificationReducer,
    compilationReducer: CompilationReducer,
    administrationReducer: AdministrationReducer,
    widgetReducer: WidgetReducer,
    partnerReducer: PartnerReducer,
    questionReducer: QuestionReducer,
    postReducer: PostReducer,
    businessProcessReducer: BusinessProcessReducer,
    agentReducer: AgentReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch