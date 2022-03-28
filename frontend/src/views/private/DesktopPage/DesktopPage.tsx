import React from 'react'
import classes from './DesktopPage.module.scss'

const DesktopPage: React.FC = () => {
    return (
        <div className={classes.DesktopPage}>
            <p>В разработке</p>
            <p>Здесь будут различные информационные блоки по принципу рабочего стола</p>
        </div>
    )
}

DesktopPage.displayName = 'DesktopPage'

export default DesktopPage