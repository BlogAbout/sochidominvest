import React from 'react'
import {Provider} from 'react-redux'
import {store} from '../store/reducers'

const withStore = (Component: any) => {
    return (props: any) => {
        return (
            <Provider store={store}>
                <Component {...props}/>
            </Provider>
        )
    }
}

export default withStore