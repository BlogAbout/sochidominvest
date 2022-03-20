import React, {useEffect} from 'react'
import AppRouter from './routes/components/AppRouter/AppRouter'
import {useActions} from './hooks/useActions'
import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faAngleDown,
    faAngleLeft,
    faArrowRotateLeft,
    faArrowUpRightFromSquare,
    faAt,
    faBell,
    faBolt,
    faBook,
    faBuilding,
    faCheck,
    faEllipsis,
    faFileExcel,
    faFlag,
    faGear,
    faHeading,
    faHeadset,
    faHouse,
    faHouseUser,
    faLocationDot,
    faLock,
    faMagnifyingGlass,
    faMessage,
    faPercent,
    faPhone,
    faPlus,
    faRightFromBracket,
    faRubleSign,
    faScrewdriverWrench,
    faStar,
    faUser,
    faUserCheck,
    faUserTie,
    faCheckDouble,
    faHeart,
    faPenToSquare,
    faPrint,
    faArrowUpFromBracket,
    fa1,
    faUpRightAndDownLeftFromCenter,
    faPaintRoller,
    faElevator,
    faBed,
    faTrash,
    faUpload,
    faTableList,
    faParagraph,
    faQuestion,
    faCircleQuestion,
    faXmark,
    faChevronDown, faCity
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
    faRubleSign,
    faMagnifyingGlass,
    faAngleDown,
    faEllipsis,
    faCheckDouble,
    faHeart,
    faPenToSquare,
    faPrint,
    faArrowUpFromBracket,
    fa1,
    faUpRightAndDownLeftFromCenter,
    faPaintRoller,
    faElevator,
    faBed,
    faTrash,
    faUpload,
    faTableList,
    faParagraph,
    faQuestion,
    faCircleQuestion,
    faXmark,
    faChevronDown,
    faCity
)

function App() {
    const {setIsAuth} = useActions()

    useEffect(() => {
        if (localStorage.getItem('auth')) {
            setIsAuth(true)
        }
    })

    return (
        <AppRouter/>
    )
}

export default App