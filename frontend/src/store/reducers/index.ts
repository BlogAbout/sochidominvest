import {applyMiddleware, combineReducers, createStore} from 'redux'
import thunk from 'redux-thunk'
import UserReducer from './userReducer'
import BuildingReducer from './buildingReducer'
import TagReducer from './tagReducer'
import DeveloperReducer from './developerReducer'

const rootReducer = combineReducers({
    userReducer: UserReducer,
    buildingReducer: BuildingReducer,
    tagReducer: TagReducer,
    developerReducer: DeveloperReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch