import React, {useEffect} from 'react'
import AppRouter from './routes/components/AppRouter/AppRouter'
import {useActions} from './hooks/useActions'
import {library} from '@fortawesome/fontawesome-svg-core'
import {
    fa1,
    faAngleDown,
    faAngleLeft,
    faArrowLeftLong,
    faArrowPointer,
    faArrowRotateLeft,
    faArrowUpFromBracket,
    faArrowUpRightFromSquare,
    faAt,
    faBars,
    faBed,
    faBell,
    faBolt,
    faBook,
    faBookmark,
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
    faEarthAsia,
    faElevator,
    faEllipsis,
    faEnvelope,
    faEye,
    faFile,
    faFileExcel,
    faFileInvoice,
    faFileLines,
    faFlag,
    faFolderTree,
    faGear,
    faGrip,
    faHandshakeAngle,
    faHeading,
    faHeadset,
    faHeart,
    faHouse,
    faHouseLaptop,
    faHouseUser,
    faIdCard,
    faImage,
    faKey,
    faLink,
    faList,
    faLocationDot,
    faLock,
    faMagnifyingGlass,
    faMessage,
    faMoneyBill1Wave,
    faMoneyCheck,
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
    faS,
    faScrewdriverWrench,
    faSliders,
    faStar,
    faTableList,
    faTrash,
    faTree,
    faUpload,
    faUpRightAndDownLeftFromCenter,
    faUser,
    faUserCheck,
    faUserGear,
    faUserTie,
    faVideo,
    faVolumeHigh,
    faVolumeXmark,
    faXmark
} from '@fortawesome/free-solid-svg-icons'
import {registerEventsEmitter, registerWebsocket} from './helpers/eventsHelper'

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
    faMoneyBill1Wave,
    faS,
    faKey,
    faList,
    faGrip,
    faIdCard,
    faBars,
    faSliders,
    faBookmark,
    faMoneyCheck,
    faFolderTree,
    faUserGear,
    faEarthAsia,
    faArrowLeftLong,
    faHouseLaptop
)

function App() {
    const {setIsAuth, setUserRole, setUserId, setUsersOnline} = useActions()

    useEffect(() => {
        registerEventsEmitter()

        if (localStorage.getItem('auth')) {
            setIsAuth(true)

            const userRole = localStorage.getItem('role') || ''
            const userId = localStorage.getItem('id') || ''

            if (userRole) {
                setUserRole(userRole)
            }

            if (userId) {
                setUserId(parseInt(userId))
                registerWebsocket(parseInt(userId))
            }
        }

        window.events.on('messengerUpdateOnlineUsers', updateOnlineUsers)

        return () => {
            window.events.removeListener('messengerUpdateOnlineUsers', updateOnlineUsers)
        }
    }, [])

    // Обновление списка пользователей онлайн
    const updateOnlineUsers = (usersString: string): void => {
        if (usersString.trim() !== '') {
            const listUsersIds: number[] = JSON.parse(usersString)

            setUsersOnline(listUsersIds)
        }
    }

    return (
        <AppRouter/>
    )
}

export default App