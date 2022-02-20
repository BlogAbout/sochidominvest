import React from 'react'
import classes from './HeaderDefault.module.scss'

const HeaderDefault: React.FC = () => {
    return (
        <header className={classes.Header}>
            <div className={classes.container}>
                <div className={classes.logo}>
                    <span className={classes.logoImage}/>
                </div>

                <div className={classes.contacts}>
                    <a className={classes.phone} href='tel:+79999999999'>+7 (999) 999-99-99</a>
                    <a className={classes.email} href='mailto:info@sochidominvest.ru'>info@sochidominvest.ru</a>
                </div>
            </div>
        </header>
    )
}

HeaderDefault.displayName = 'HeaderDefault'

export default HeaderDefault