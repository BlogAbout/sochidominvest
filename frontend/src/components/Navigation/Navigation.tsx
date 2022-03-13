import React from 'react'
import {NavLink} from 'react-router-dom'
import {RouteNames} from '../../routes/routes'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classes from './Navigation.module.scss'

const Navigation: React.FC = () => {
    return (
        <nav className={classes.Navigation}>
            <ul className={classes.menu}>
                <li>
                    <NavLink to={RouteNames.MAIN}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Рабочий стол'
                    >
                        <FontAwesomeIcon icon='house'/>
                    </NavLink>
                </li>

                <li>
                    <NavLink to={RouteNames.FAVORITE}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Избранное'
                    >
                        <FontAwesomeIcon icon='heart'/>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={RouteNames.COMPILATION}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Подборка'
                    >
                        <FontAwesomeIcon icon='table-list'/>
                    </NavLink>
                </li>
            </ul>

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
                    </NavLink>
                </li>
                <li>
                    <NavLink to={RouteNames.TOOL}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Инструкменты'
                    >
                        <FontAwesomeIcon icon='screwdriver-wrench'/>
                    </NavLink>
                </li>

            </ul>
        </nav>
    )
}

Navigation.displayName = 'Navigation'

export default Navigation