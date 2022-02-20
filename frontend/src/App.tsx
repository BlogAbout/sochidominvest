import React, {useEffect} from 'react'
import AppRouter from './routes/components/AppRouter/AppRouter'
import {useActions} from './hooks/useActions'
import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faAngleLeft,
    faAt,
    faBell,
    faBook,
    faBuilding,
    faFileExcel,
    faGear,
    faLock,
    faMessage,
    faPhone,
    faRightFromBracket,
    faScrewdriverWrench,
    faUser
} from '@fortawesome/free-solid-svg-icons'

library.add(
    faUser,
    faLock,
    faPhone,
    faAt,
    faBuilding,
    faScrewdriverWrench,
    faBook,
    faFileExcel,
    faGear,
    faBell,
    faMessage,
    faRightFromBracket,
    faAngleLeft
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