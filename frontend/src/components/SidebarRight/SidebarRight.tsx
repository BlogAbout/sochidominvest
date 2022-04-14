import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useActions} from '../../hooks/useActions'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import {RouteNames} from '../../routes/routes'
import openPopupUserCreate from '../PopupUserCreate/PopupUserCreate'
import classes from './SidebarRight.module.scss'
import NotificationPanel from "../NotificationPanel/NotificationPanel";

const SidebarRight: React.FC = () => {
    const [isShowNotification, setIsShowNotification] = useState(false)

    const {userId} = useTypedSelector(state => state.userReducer)
    const {logout} = useActions()

    return (
        <>
            <aside className={classes.SidebarRight}>
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