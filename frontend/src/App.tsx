import React from 'react'
import AppRouter from './routes/components/AppRouter/AppRouter'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faUser, faLock} from '@fortawesome/free-solid-svg-icons'

library.add(
    faUser,
    faLock
)

function App() {
    return (
        <AppRouter/>
    )
}

export default App