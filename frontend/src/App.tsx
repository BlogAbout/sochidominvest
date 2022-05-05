import React, {useEffect} from 'react'
import AppRouter from './routes/components/AppRouter/AppRouter'
import {useActions} from './hooks/useActions'
import {library} from '@fortawesome/fontawesome-svg-core'
import {
    fa1,
    faAngleDown,
    faAngleLeft,
    faArrowPointer,
    faArrowRotateLeft,
    faArrowUpFromBracket,
    faArrowUpRightFromSquare,
    faAt,
    faBed,
    faBell,
    faBolt,
    faBook,
    faBorderAll,
    faBuilding,
    faBuildingColumns,
    faCalendar,
    faCalendarPlus,
    faCar,
    faCashRegister,
    faCheck,
    faCheckDouble,
    faChevronDown,
    faCircleQuestion,
    faCity,
    faDatabase,
    faElevator,
    faEllipsis,
    faEnvelope,
    faEye,
    faFile,
    faFileExcel,
    faFileInvoice,
    faFileLines,
    faFlag,
    faGear,
    faHandshakeAngle,
    faHeading,
    faHeadset,
    faHeart,
    faHouse,
    faHouseUser,
    faImage,
    faLink,
    faLocationDot,
    faLock,
    faMagnifyingGlass,
    faMessage,
    faMoneyBill1Wave,
    faNewspaper,
    faPaintRoller,
    faPaperclip,
    faParagraph,
    faPause,
    faPenToSquare,
    faPercent,
    faPhone,
    faPhotoFilm,
    faPlay,
    faPlus,
    faPrint,
    faQuestion,
    faRectangleAd,
    faRightFromBracket,
    faRubleSign,
    faScrewdriverWrench,
    faStar,
    faTableList,
    faTrash,
    faTree,
    faUpload,
    faUpRightAndDownLeftFromCenter,
    faUser,
    faUserCheck,
    faUserTie,
    faVideo,
    faVolumeHigh,
    faVolumeXmark,
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
    faLink,
    faNewspaper,
    faFileLines,
    faFileInvoice,
    faBuildingColumns,
    faTree,
    faCashRegister,
    faCar,
    faHouseUser,
    faEye,
    faPhotoFilm,
    faImage,
    faVideo,
    faFile,
    faArrowPointer,
    faPlay,
    faPause,
    faVolumeHigh,
    faVolumeXmark,
    faBorderAll,
    faCalendarPlus,
    faDatabase,
    faEnvelope,
    faCalendar,
    faRectangleAd,
    faHandshakeAngle,
    faMoneyBill1Wave
)

function App() {
    const {setIsAuth, setUserRole, setUserId} = useActions()

    useEffect(() => {
        if (localStorage.getItem('auth')) {
            setIsAuth(true)

            const userRole = localStorage.getItem('role') || ''
            const userId = localStorage.getItem('id') || ''

            if (userRole) {
                setUserRole(userRole)
            }

            if (userId) {
                setUserId(parseInt(userId))
            }
        }
    })

    return (
        <AppRouter/>
    )
}

export default App