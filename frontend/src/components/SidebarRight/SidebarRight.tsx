import React from 'react'
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useActions} from '../../hooks/useActions'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import {RouteNames} from '../../routes/routes'
import openPopupUserCreate from '../PopupUserCreate/PopupUserCreate'
import classes from './SidebarRight.module.scss'

const SidebarRight: React.FC = () => {
    const {userId} = useTypedSelector(state => state.userReducer)
    const {logout} = useActions()

    return (
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

            <div className={classes.icon} title='Уведомления'>
                <FontAwesomeIcon icon='bell'/>
            </div>

            <div className={classes.icon}>
                <Link to={RouteNames.PROFILE} title='Настройки'>
                    <FontAwesomeIcon icon='gear'/>
                </Link>
            </div>

            <div className={classes.icon} title='Выход' onClick={logout.bind(this)}>
                <FontAwesomeIcon icon='right-from-bracket'/>
            </div>
        </aside>
    )
}

SidebarRight.displayName = 'SidebarRight'

export default SidebarRight