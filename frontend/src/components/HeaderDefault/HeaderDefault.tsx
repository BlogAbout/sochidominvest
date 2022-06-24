import React, {useState} from 'react'
import classNames from 'classnames/bind'
import {Link, NavLink} from 'react-router-dom'
import {RouteNames} from '../../routes/routes'
import {configuration} from '../../helpers/utilHelper'
import classes from './HeaderDefault.module.scss'

const cx = classNames.bind(classes)

const HeaderDefault: React.FC = () => {
    const [openMenu, setOpenMenu] = useState(false)

    return (
        <header className={classes.HeaderDefault}>
            <div className={classes.container}>
                <div className={classes.logo}>
                    <Link to={RouteNames.MAIN}>
                        <span className={classes.logoImage}/>
                    </Link>
                </div>

                <nav className={cx({'mainMenu': true, 'open': openMenu})}>
                    <NavLink to={RouteNames.MAIN}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Главная'
                             onClick={() => setOpenMenu(false)}
                    >
                        <span>Главная</span>
                    </NavLink>

                    <NavLink to={RouteNames.PUBLIC_ABOUT}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='О компании'
                             onClick={() => setOpenMenu(false)}
                    >
                        <span>О компании</span>
                    </NavLink>

                    <NavLink to={RouteNames.PUBLIC_BUILDING}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Недвижимость'
                             onClick={() => setOpenMenu(false)}
                    >
                        <span>Недвижимость</span>
                    </NavLink>

                    <NavLink to={RouteNames.PUBLIC_ARTICLE}
                             className={({isActive}) => isActive ? classes.active : ''}
                             title='Статьи'
                             onClick={() => setOpenMenu(false)}
                    >
                        <span>Статьи</span>
                    </NavLink>
                </nav>

                <div className={classes.contacts}>
                    <div className={classes.inner}>
                        <a href={configuration.sitePhoneUrl} className={classes.phone}>{configuration.sitePhone}</a>
                        <a href={configuration.siteEmailUrl} className={classes.email}>{configuration.siteEmail}</a>
                    </div>
                </div>

                <div className={cx({'toggleMenu': true, 'open': openMenu})} onClick={() => setOpenMenu(!openMenu)}>
                    <span/>
                </div>
            </div>
        </header>
    )
}

HeaderDefault.displayName = 'HeaderDefault'

export default HeaderDefault