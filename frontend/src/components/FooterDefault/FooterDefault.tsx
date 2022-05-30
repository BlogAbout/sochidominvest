import React from 'react'
import {Link} from 'react-router-dom'
import {RouteNames} from '../../routes/routes'
import classes from './FooterDefault.module.scss'

const FooterDefault: React.FC = () => {
    return (
        <footer className={classes.Footer}>
            <div className={classes.container}>
                <p>ИНН 344800846072</p>
                <p/>
                <p><Link to={RouteNames.PUBLIC_POLICY}>Политика конфиденциальности</Link></p>
                <p>2022. Все права защищены</p>
            </div>
        </footer>
    )
}

FooterDefault.displayName = 'FooterDefault'

export default FooterDefault