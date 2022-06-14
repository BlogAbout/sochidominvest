import React from 'react'
import {Link} from 'react-router-dom'
import {RouteNames} from '../../../routes/routes'
import classes from './FooterDefault.module.scss'

const FooterDefault: React.FC = () => {
    return (
        <footer className={classes.Footer}>
            <div className={classes.container}>
                <ul className={classes.menu}>
                    <li><Link to={RouteNames.PUBLIC_ABOUT}>О компании</Link></li>
                    <li><Link to={RouteNames.PUBLIC_FAQ}>F.A.Q.</Link></li>
                    <li><Link to={RouteNames.PUBLIC_POLICY}>Политика конфиденциальности</Link></li>
                </ul>
                <div className={classes.info}>
                    <p>ИНН 344800846072</p>
                    <p/>
                    <p/>
                    <p className={classes.copyright}>2022. Все права защищены</p>
                </div>
            </div>
        </footer>
    )
}

FooterDefault.displayName = 'FooterDefault'

export default FooterDefault