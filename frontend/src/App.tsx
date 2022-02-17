import React from 'react'
import AppRouter from './routes/components/AppRouter/AppRouter'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faUser, faLock, faPhone} from '@fortawesome/free-solid-svg-icons'

library.add(
    faUser,
    faLock,
    faPhone
)

function App() {
    return (
        <AppRouter/>
    )
}

export default App