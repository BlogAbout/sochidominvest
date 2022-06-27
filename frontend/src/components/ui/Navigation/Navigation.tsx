import React, {useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classNames from 'classnames/bind'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {NavLink} from 'react-router-dom'
import {RouteNames} from '../../../routes/routes'
import classes from './Navigation.module.scss'

const cx = classNames.bind(classes)

const Navigation: React.FC = () => {
    const [showMenu, setShowMenu] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)

    const onHideMenuHandler = () => {
        setShowMenu(false)
    }

    return (
        <>
            <div className={classes.toggle} onClick={() => setShowMenu(!showMenu)}>
                <FontAwesomeIcon icon={showMenu ? 'xmark' : 'bars'}/>
            </div>

            <nav className={cx({'Navigation': true, 'show': showMenu})}>
                <ul className={classes.menu}>
                    <li>
                        <NavLink to={RouteNames.MAIN}
                                 className={({isActive}) => isActive ? classes.active : ''}
                                 title='Рабочий стол'
                                 onClick={() => onHideMenuHandler()}
                        >
                            <span className={classes.icon}><FontAwesomeIcon icon='house'/></span>
                            <span className={classes.title}>Рабочий стол</span>
                        </NavLink>
                    </li>

                    <li className={classes.spacer}/>

                    {['director', 'administrator'].includes(role) &&
                    <li>
                        <NavLink to={RouteNames.USER}
                                 className={({isActive}) => isActive ? classes.active : ''}
                                 title='Пользователи'
                                 onClick={() => onHideMenuHandler()}
                        >
                            <span className={classes.icon}><FontAwesomeIcon icon='user'/></span>
                            <span className={classes.title}>Пользователи</span>
                        </NavLink>
                    </li>
                    }

                    <li>
                        <NavLink to={RouteNames.BUILDING}
                                 className={({isActive}) => isActive ? classes.active : ''}
                                 title='Недвижимость'
                                 onClick={() => onHideMenuHandler()}
                        >
                            <span className={classes.icon}><FontAwesomeIcon icon='building'/></span>
                            <span className={classes.title}>Недвижимость</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to={RouteNames.ARTICLE}
                                 className={({isActive}) => isActive ? classes.active : ''}
                                 title='Статьи'
                                 onClick={() => onHideMenuHandler()}
                        >
                            <span className={classes.icon}><FontAwesomeIcon icon='newspaper'/></span>
                            <span className={classes.title}>Статьи</span>
                        </NavLink>
                    </li>

                    {['director', 'administrator', 'manager'].includes(role) &&
                    <>
                        <li className={classes.spacer}/>

                        <li>
                            <NavLink to={RouteNames.FILE_MANAGER}
                                     className={({isActive}) => isActive ? classes.active : ''}
                                     title='Файловый менеджер'
                                     onClick={() => onHideMenuHandler()}
                            >
                                <span className={classes.icon}><FontAwesomeIcon icon='photo-film'/></span>
                                <span className={classes.title}>Файловый менеджер</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to={RouteNames.CRM}
                                     className={({isActive}) => isActive ? classes.active : ''}
                                     title='CRM'
                                     onClick={() => onHideMenuHandler()}
                            >
                                <span className={classes.icon}><FontAwesomeIcon icon='folder-tree'/></span>
                                <span className={classes.title}>CRM</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to={RouteNames.DOCUMENT}
                                     className={({isActive}) => isActive ? classes.active : ''}
                                     title='Документы'
                                     onClick={() => onHideMenuHandler()}
                            >
                                <span className={classes.icon}><FontAwesomeIcon icon='book'/></span>
                                <span className={classes.title}>Документы</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to={RouteNames.REPORT}
                                     className={({isActive}) => isActive ? classes.active : ''}
                                     title='Отчеты'
                                     onClick={() => onHideMenuHandler()}
                            >
                                <span className={classes.icon}><FontAwesomeIcon icon='file-excel'/></span>
                                <span className={classes.title}>Отчеты</span>
                            </NavLink>
                        </li>
                    </>
                    }

                    <li className={classes.spacer}/>

                    {['director', 'administrator'].includes(role) &&
                    <>
                        <li>
                            <NavLink to={RouteNames.TOOL}
                                     className={({isActive}) => isActive ? classes.active : ''}
                                     title='Инструменты'
                                     onClick={() => onHideMenuHandler()}
                            >
                                <span className={classes.icon}><FontAwesomeIcon icon='screwdriver-wrench'/></span>
                                <span className={classes.title}>Инструменты</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={RouteNames.ADMINISTRATION}
                                     className={({isActive}) => isActive ? classes.active : ''}
                                     title='Администрирование'
                                     onClick={() => onHideMenuHandler()}
                            >
                                <span className={classes.icon}><FontAwesomeIcon icon='gear'/></span>
                                <span className={classes.title}>Администрирование</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={RouteNames.ADVERTISING}
                                     className={({isActive}) => isActive ? classes.active : ''}
                                     title='Рекламные материалы'
                                     onClick={() => onHideMenuHandler()}
                            >
                                <span className={classes.icon}><FontAwesomeIcon icon='rectangle-ad'/></span>
                                <span className={classes.title}>Рекламные материалы</span>
                            </NavLink>
                        </li>
                    </>
                    }

                    <li>
                        <NavLink to={RouteNames.SUPPORT}
                                 className={({isActive}) => isActive ? classes.active : ''}
                                 title='Поддержка'
                                 onClick={() => onHideMenuHandler()}
                        >
                            <span className={classes.icon}><FontAwesomeIcon icon='question'/></span>
                            <span className={classes.title}>Поддержка</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </>
    )
}

Navigation.displayName = 'Navigation'

export default Navigation