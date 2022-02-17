import React from 'react'
import classes from './HeaderDefault.module.scss'

const HeaderDefault: React.FC = () => {
    return (
        <header className={classes.Header}>
            <div className={classes.container}>
                <div className={classes.logo}>

                </div>

                <div className={classes.phone}>
                    <a href=''>+7 (999) 999-99-99</a>
                </div>
            </div>
        </header>
    )
}

HeaderDefault.displayName = 'HeaderDefault'

export default HeaderDefault