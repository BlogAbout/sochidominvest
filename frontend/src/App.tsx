import React, {useEffect} from 'react'
import AppRouter from './routes/components/AppRouter/AppRouter'
import {useActions} from './hooks/useActions'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faUser, faLock, faPhone, faAt} from '@fortawesome/free-solid-svg-icons'

library.add(
    faUser,
    faLock,
    faPhone,
    faAt
)

function App() {
    const {setIsAuth} = useActions()

    useEffect(() => {
        if (localStorage.getItem('auth')) {
            setIsAuth(true)
        }
    }, [])

    return (
        <AppRouter/>
    )
}

export default App