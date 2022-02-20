import React from 'react'
import {Link, NavLink} from 'react-router-dom'
import {RouteNames} from '../../routes/routes'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classes from './Navigation.module.scss'

const Navigation: React.FC = () => {
    return (
        <nav className={classes.Navigation}>
            <div className={classes.logo}>
                <Link to={RouteNames.MAIN}>
                    <span className={classes.logoImage} title='Вернуться на главную'/>
                </Link>
            </div>

            <ul className={classes.links}>
                <li>
                    <NavLink to={RouteNames.USER}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Пользователи'
                    >
                        <FontAwesomeIcon icon='user'/>
                        <span>Пользователи</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={RouteNames.BUILDING}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Недвижимость'
                    >
                        <FontAwesomeIcon icon='building'/>
                        <span>Недвижимость</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={RouteNames.DOCUMENT}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Документы'
                    >
                        <FontAwesomeIcon icon='book'/>
                        <span>Документы</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={RouteNames.REPORT}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Отчеты'
                    >
                        <FontAwesomeIcon icon='file-excel'/>
                        <span>Отчеты</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={RouteNames.TOOL}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Инструкменты'
                    >
                        <FontAwesomeIcon icon='screwdriver-wrench'/>
                        <span>Инструкменты</span>
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}

Navigation.displayName = 'Navigation'

export default Navigation