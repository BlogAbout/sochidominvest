import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import NotificationService from '../../../api/NotificationService'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useActions} from '../../../hooks/useActions'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {RouteNames} from '../../../routes/routes'
import NotificationPanel from '../../NotificationPanel/NotificationPanel'
import openPopupUserCreate from '../../popup/PopupUserCreate/PopupUserCreate'
import openPopupSearchPanel from '../../popup/PopupSearchPanel/PopupSearchPanel'
import openPopupMessenger from '../../popup/PopupMessenger/PopupMessenger'
import classes from './SidebarRight.module.scss'

const SidebarRight: React.FC = () => {
    const navigate = useNavigate()

    const [isShowNotification, setIsShowNotification] = useState(false)
    const [countNewNotification, setCountNewNotification] = useState(0)

    const {userId, role} = useTypedSelector(state => state.userReducer)
    const {logout} = useActions()

    useEffect(() => {
        getCountNewNotification()

        window.events.addListener('messengerCountNotificationsIncrease', countNewNotificationIncrease)
        window.events.addListener('messengerCountNewNotificationUpdate', countNewNotificationUpdate)

        return () => {
            window.events.removeListener('messengerCountNotificationsIncrease', countNewNotificationIncrease)
            window.events.removeListener('messengerCountNewNotificationUpdate', countNewNotificationUpdate)
        }
    }, [countNewNotification])

    // Получение количества новых уведомлений
    const getCountNewNotification = () => {
        NotificationService.fetchCountNewNotifications()
            .then((response: any) => setCountNewNotification(response.data))
            .catch((error: any) => console.error('Ошибка получения количества новых уведомлений', error))
    }

    // Увеличение счетчика количества новых уведомлений
    const countNewNotificationIncrease = () => {
        countNewNotificationUpdate(countNewNotification + 1)
    }

    const countNewNotificationUpdate = (count: number) => {
        setCountNewNotification(count)
    }

    return (
        <>
            <aside className={classes.SidebarRight}>
                <div className={classes.icon}
                     title='Глобальный поиск'
                     onClick={() => {
                         openPopupSearchPanel(document.body, {
                             role: role,
                             navigate: navigate
                         })
                     }}
                >
                    <FontAwesomeIcon icon='magnifying-glass'/>
                </div>

                <div className={classes.icon}
                     title='Профиль'
                     onClick={() => {
                         if (userId) {
                             openPopupUserCreate(document.body, {
                                 user: null,
                                 userId: userId,
                                 onSave: () => {
                                 }
                             })
                         }
                     }}
                >
                    <FontAwesomeIcon icon='user'/>
                </div>

                <div className={classes.icon}>
                    <Link to={RouteNames.FAVORITE} title='Избранное'>
                        <FontAwesomeIcon icon='heart'/>
                    </Link>
                </div>

                <div className={classes.icon}
                     title='Мессенджер'
                     onClick={() => openPopupMessenger(document.body, {})}
                >
                    <FontAwesomeIcon icon='message'/>
                </div>

                <div className={classes.icon}
                     title='Уведомления'
                     onClick={() => setIsShowNotification(!isShowNotification)}
                >
                    <FontAwesomeIcon icon='bell'/>

                    {countNewNotification > 0 ? <div className={classes.counter}>{countNewNotification}</div> : null}
                </div>

                <div className={classes.icon}
                     title='Выход'
                     onClick={logout.bind(this)}
                >
                    <FontAwesomeIcon icon='right-from-bracket'/>
                </div>
            </aside>

            {isShowNotification &&
            <NotificationPanel isShow={isShowNotification} onShow={() => setIsShowNotification(false)}/>}
        </>
    )
}

SidebarRight.displayName = 'SidebarRight'

export default SidebarRight