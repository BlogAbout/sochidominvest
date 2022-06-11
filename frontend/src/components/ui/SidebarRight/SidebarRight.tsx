import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import NotificationService from '../../../api/NotificationService'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useActions} from '../../../hooks/useActions'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {RouteNames} from '../../../routes/routes'
import openPopupUserCreate from '../../popup/PopupUserCreate/PopupUserCreate'
import openPopupSearchPanel from '../../popup/PopupSearchPanel/PopupSearchPanel'
import NotificationPanel from '../../NotificationPanel/NotificationPanel'
import classes from './SidebarRight.module.scss'

const SidebarRight: React.FC = () => {
    const navigate = useNavigate()

    const [isShowNotification, setIsShowNotification] = useState(false)
    const [countNewNotification, setCountNewNotification] = useState(0)

    const {userId, role} = useTypedSelector(state => state.userReducer)
    const {logout} = useActions()

    let intervalTimer: any = null

    useEffect(() => {
        updateCountNewNotification()

        if (intervalTimer) {
            clearInterval(intervalTimer)
        }

        intervalTimer = setInterval(function () {
            updateCountNewNotification()
        }, 7200000)
    })

    const updateCountNewNotification = () => {
        NotificationService.fetchCountNewNotifications()
            .then((response: any) => setCountNewNotification(response.data))
            .catch((error: any) => console.error('Ошибка получения количества новых уведомлений', error))
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

                <div className={classes.icon}>
                    <Link to={RouteNames.COMPILATION} title='Подборка'>
                        <FontAwesomeIcon icon='table-list'/>
                    </Link>
                </div>

                <div className={classes.icon} title='Мессенджер'>
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