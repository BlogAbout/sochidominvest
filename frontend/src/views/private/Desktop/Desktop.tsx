import React from 'react'
import classes from './Desktop.module.scss'

const Desktop: React.FC = () => {
    return (
        <div className={classes.Desktop}>
            <p>В разработке</p>
            <p>Здесь будут различные информационные блоки по принципу рабочего стола</p>
        </div>
    )
}

Desktop.displayName = 'Desktop'

export default Desktop