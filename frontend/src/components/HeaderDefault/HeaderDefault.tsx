import React from 'react'
import {Link} from 'react-router-dom'
import classes from './HeaderDefault.module.scss'

const HeaderDefault: React.FC = () => {
    return (
        <header className={classes.Header}>
            <div className={classes.container}>
                <div className={classes.logo}>
                    <Link to='/'>
                        <span className={classes.logoImage}/>
                    </Link>
                </div>

                <div className={classes.contacts}>
                    <a className={classes.phone} href='tel:+79186053427'>+7 (918) 605-34-27</a>
                    <a className={classes.email} href='mailto:info@sochidominvest.ru'>info@sochidominvest.ru</a>
                </div>
            </div>
        </header>
    )
}

HeaderDefault.displayName = 'HeaderDefault'

export default HeaderDefault