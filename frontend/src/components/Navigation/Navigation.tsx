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
                        <span className={classes.icon}><FontAwesomeIcon icon='house'/></span>
                        <span className={classes.title}>Рабочий стол</span>
                    </NavLink>
                </li>

                <li className={classes.spacer}/>

                <li>
                    <NavLink to={RouteNames.USER}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Пользователи'
                    >
                        <span className={classes.icon}><FontAwesomeIcon icon='user'/></span>
                        <span className={classes.title}>Пользователи</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink to={RouteNames.BUILDING}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Недвижимость'
                    >
                        <span className={classes.icon}><FontAwesomeIcon icon='building'/></span>
                        <span className={classes.title}>Недвижимость</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink to={RouteNames.DOCUMENT}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Документы'
                    >
                        <span className={classes.icon}><FontAwesomeIcon icon='book'/></span>
                        <span className={classes.title}>Документы</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink to={RouteNames.ARTICLE}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Статьи'
                    >
                        <span className={classes.icon}><FontAwesomeIcon icon='newspaper'/></span>
                        <span className={classes.title}>Статьи</span>
                    </NavLink>
                </li>

                <li className={classes.spacer}/>

                <li>
                    <NavLink to={RouteNames.DEVELOPER}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Застройщики'
                    >
                        <span className={classes.icon}><FontAwesomeIcon icon='city'/></span>
                        <span className={classes.title}>Застройщики</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink to={RouteNames.REPORT}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Отчеты'
                    >
                        <span className={classes.icon}><FontAwesomeIcon icon='file-excel'/></span>
                        <span className={classes.title}>Отчеты</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink to={RouteNames.TOOL}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Инструменты'
                    >
                        <span className={classes.icon}><FontAwesomeIcon icon='screwdriver-wrench'/></span>
                        <span className={classes.title}>Инструменты</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink to={RouteNames.SUPPORT}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Поддержка'
                    >
                        <span className={classes.icon}><FontAwesomeIcon icon='question'/></span>
                        <span className={classes.title}>Поддержка</span>
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}

Navigation.displayName = 'Navigation'

export default Navigation