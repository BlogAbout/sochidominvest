import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import {store} from './store/reducers'
import 'lightgallery.js/dist/css/lightgallery.css'
import {LightgalleryProvider} from 'react-lightgallery'
import App from './App'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <LightgalleryProvider lightgallerySettings={{
                mode: 'lg-fade',
                cssEasing : 'cubic-bezier(0.25, 0, 0.25, 1)',
                loop: true,
                preload: 1,
                download: false
            }}>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </LightgalleryProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)

reportWebVitals()