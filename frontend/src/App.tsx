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
    faBuilding,
    faBuildingColumns,
    faCar,
    faCashRegister,
    faCheck,
    faCheckDouble,
    faChevronDown,
    faCircleQuestion,
    faCity,
    faElevator,
    faEllipsis,
    faEye,
    faFile,
    faFileExcel,
    faFileInvoice,
    faFileLines,
    faFlag,
    faGear,
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
    faVolumeXmark
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