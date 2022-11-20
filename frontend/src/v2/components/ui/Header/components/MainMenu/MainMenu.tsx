import React, {useState} from 'react'
import {NavLink} from 'react-router-dom'
import classNames from 'classnames/bind'
import {IMenuLink} from '../../../../../../@types/IMenu'
import {menuMain} from '../../../../../helpers/menuHelper'
import MenuToggle from '../../../MenuToggle/MenuToggle'
import classes from './MainMenu.module.scss'

const cx = classNames.bind(classes)

const MainMenu: React.FC = (): React.ReactElement => {
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    // Показать/скрыть мобильное меню
    const onToggleMobileMenuHandler = () => {
        setShowMobileMenu(!showMobileMenu)
    }

    // Скрыть мобильного меню
    const onHideMobileMenuHandler = () => {
        setShowMobileMenu(false)
    }

    return (
        <div className={classes.MainMenu}>
            <MenuToggle show={showMobileMenu} onToggle={onToggleMobileMenuHandler.bind(this)}/>

            <nav className={cx({'navigation': true, 'show': showMobileMenu})}>
                {menuMain.map((link: IMenuLink) => {
                    return (
                        <NavLink to={link.route}
                                 className={({isActive}) => isActive ? classes.active : ''}
                                 title={link.text || link.title}
                                 onClick={onHideMobileMenuHandler.bind(this)}
                                 key={link.route}
                        >
                            <span>{link.title}</span>
                        </NavLink>
                    )
                })}
            </nav>
        </div>
    )
}

MainMenu.displayName = 'MainMenu'

export default React.memo(MainMenu)