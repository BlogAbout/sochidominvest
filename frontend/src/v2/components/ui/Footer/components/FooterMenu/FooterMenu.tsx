import React from 'react'
import {NavLink} from 'react-router-dom'
import {IMenuLink} from '../../../../../../@types/IMenu'
import {menuFooter} from '../../../../../helpers/menuHelper'
import classes from './FooterMenu.module.scss'

const FooterMenu: React.FC = (): React.ReactElement => {
    return (
        <div className={classes.FooterMenu}>
            {menuFooter.map((link: IMenuLink) => {
                return (
                    <div className={classes.item}>
                        <NavLink to={link.route}
                                 className={({isActive}) => isActive ? classes.active : ''}
                                 title={link.text || link.title}
                                 key={link.route}
                        >
                            <span>{link.title}</span>
                        </NavLink>
                    </div>
                )
            })}
        </div>
    )
}

FooterMenu.displayName = 'FooterMenu'

export default React.memo(FooterMenu)