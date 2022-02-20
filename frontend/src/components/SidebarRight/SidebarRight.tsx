import React from 'react'
import {Link} from 'react-router-dom'
import {useActions} from '../../hooks/useActions'
import {RouteNames} from '../../routes/routes'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classes from './SidebarRight.module.scss'

const SidebarRight: React.FC = () => {
    const {logout} = useActions()

    return (
        <aside className={classes.SidebarRight}>
            <div className={classes.icon} title='Профиль'>
                <FontAwesomeIcon icon='user'/>
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