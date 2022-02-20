import React from 'react'
import classes from './MainService.module.scss'

const MainService: React.FC = () => {
    return (
        <div className={classes.MainService}>
            <p>В разработке</p>
            <p>Здесь будут различные информационные блоки по принципу рабочего стола</p>
        </div>
    )
}

MainService.displayName = 'MainService'

export default MainService