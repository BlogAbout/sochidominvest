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

const rootReducer = combineReducers({
    userReducer: UserReducer,
    buildingReducer: BuildingReducer,
    tagReducer: TagReducer,
    developerReducer: DeveloperReducer,
    documentReducer: DocumentReducer,
    articleReducer: ArticleReducer,
    notificationReducer: NotificationReducer,
    compilationReducer: CompilationReducer,
    administrationReducer: AdministrationReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch