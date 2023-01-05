import React, {useEffect, useState} from 'react'
import {NavLink} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import classNames from 'classnames/bind'
import {IMenuLink} from '../../../../@types/IMenu'
import {IUser} from '../../../../@types/IUser'
import {getUserFromStorage} from '../../../../helpers/userHelper'
import {allowForRole, allowForTariff} from '../../../helpers/accessHelper'
import {menuPanel} from '../../../helpers/menuHelper'
import MenuToggle from '../MenuToggle/MenuToggle'
import Avatar from '../../../../components/ui/Avatar/Avatar'
import openPopupUserCreate from '../../../../components/popup/PopupUserCreate/PopupUserCreate'
import classes from './Navigation.module.scss'

const cx = classNames.bind(classes)

const Navigation: React.FC = (): React.ReactElement => {
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [user, setUser] = useState<IUser>({
        id: null,
        email: '',
        phone: '',
        password: '',
        firstName: '',
        role: 'subscriber',
        active: 1,
        lastActive: null,
        settings: null,
        tariff: 'free'
    })

    useEffect(() => {
        const userUpdate: IUser | null = getUserFromStorage()

        if (userUpdate) {
            setUser(userUpdate)
        }
    }, [])

    const onToggleMobileMenuHandler = () => {
        setShowMobileMenu(!showMobileMenu)
    }

    const onHideMobileMenuHandler = () => {
        setShowMobileMenu(false)
    }

    return (
        <>
            <MenuToggle show={showMobileMenu}
                        onToggle={onToggleMobileMenuHandler.bind(this)}
                        inPanel
            />

            <nav className={cx({'Navigation': true, 'show': showMobileMenu})}>
                <div className={classes.profile}
                     title={`Редактировать профиль: ${user.firstName}`}
                     onClick={() => {
                         if (user && user.id) {
                             openPopupUserCreate(document.body, {
                                 user: null,
                                 userId: user.id,
                                 onSave: () => {
                                     const userUpdate: IUser | null = getUserFromStorage()
                                     if (userUpdate) {
                                         setUser(userUpdate)
                                     }
                                 }
                             })
                         }
                     }}
                >
                    <Avatar href={user?.avatar} alt={user?.firstName} width={46} height={46}/>
                </div>

                <ul className={classes.menu}>
                    {menuPanel.map((link: IMenuLink, index: number) => {
                        if (!allowForRole(link.hasRole) || !allowForTariff(link.hasTariff)) {
                            return null
                        }

                        if (link.isSeparator) {
                            return <li key={`separator-${index}`} className={classes.spacer}/>
                        }

                        return (
                            <li>
                                <NavLink to={link.route}
                                         className={({isActive}) => isActive ? classes.active : ''}
                                         title={link.text || link.title}
                                         onClick={onHideMobileMenuHandler.bind(this)}
                                         key={link.route}
                                >
                                    {link.icon ?
                                        <span className={classes.icon}>
                                            <FontAwesomeIcon icon={link.icon}/>
                                        </span>
                                        : null
                                    }

                                    <span className={classes.title}>{link.text}</span>
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </>
    )
}

Navigation.displayName = 'Navigation'

export default Navigation