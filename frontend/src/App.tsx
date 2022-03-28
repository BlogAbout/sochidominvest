import React, {useEffect} from 'react'
import AppRouter from './routes/components/AppRouter/AppRouter'
import {useActions} from './hooks/useActions'
import {library} from '@fortawesome/fontawesome-svg-core'
import {
    fa1,
    faAngleDown,
    faAngleLeft,
    faArrowRotateLeft,
    faArrowUpFromBracket,
    faArrowUpRightFromSquare,
    faAt,
    faBed,
    faBell,
    faBolt,
    faBook,
    faBuilding,
    faCheck,
    faCheckDouble,
    faChevronDown,
    faCircleQuestion,
    faCity,
    faElevator,
    faEllipsis,
    faFileExcel,
    faFlag,
    faGear,
    faHeading,
    faHeadset,
    faHeart,
    faHouse,
    faHouseUser,
    faLink,
    faLocationDot,
    faLock,
    faMagnifyingGlass,
    faMessage,
    faPaintRoller,
    faPaperclip,
    faParagraph,
    faPenToSquare,
    faPercent,
    faPhone,
    faPlus,
    faPrint,
    faQuestion,
    faRightFromBracket,
    faRubleSign,
    faScrewdriverWrench,
    faStar,
    faTableList,
    faTrash,
    faUpload,
    faUpRightAndDownLeftFromCenter,
    faUser,
    faUserCheck,
    faUserTie,
    faXmark
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
    faCity,
    faPaperclip,
    faLink
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