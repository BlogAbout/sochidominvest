import {applyMiddleware, combineReducers, createStore} from 'redux'
import thunk from 'redux-thunk'
import AuthReducer from './authReducer'
import UserReducer from './userReducer'
import BuildingReducer from './buildingReducer'
import TagReducer from './tagReducer'

const rootReducer = combineReducers({
    authReducer: AuthReducer,
    userReducer: UserReducer,
    buildingReducer: BuildingReducer,
    tagReducer: TagReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch