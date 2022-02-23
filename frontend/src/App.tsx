import React, {useEffect} from 'react'
import AppRouter from './routes/components/AppRouter/AppRouter'
import {useActions} from './hooks/useActions'
import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faAngleLeft, faArrowRotateLeft, faArrowUpRightFromSquare,
    faAt,
    faBell,
    faBolt,
    faBook,
    faBuilding, faCheck,
    faFileExcel, faFlag,
    faGear, faHeading, faHeadset,
    faHouse, faHouseUser, faLocationDot,
    faLock,
    faMessage, faPercent,
    faPhone, faPlus,
    faRightFromBracket, faRubleSign,
    faScrewdriverWrench, faStar,
    faUser, faUserCheck, faUserTie
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
    faAngleLeft,
    faHouse,
    faBolt,
    faPercent,
    faFlag,
    faStar,
    faPlus,
    faUserTie,
    faHouseUser,
    faHeadset,
    faCheck,
    faArrowRotateLeft,
    faUserCheck,
    faHeading,
    faLocationDot,
    faArrowUpRightFromSquare,
    faRubleSign
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