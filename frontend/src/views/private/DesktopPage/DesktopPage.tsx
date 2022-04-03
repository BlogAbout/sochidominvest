import React from 'react'
import Helmet from 'react-helmet'
import classes from './DesktopPage.module.scss'

const DesktopPage: React.FC = () => {
    return (
        <div className={classes.DesktopPage}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Рабочий стол - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <p>В разработке</p>
            <p>Здесь будут различные информационные блоки по принципу рабочего стола</p>
        </div>
    )
}

DesktopPage.displayName = 'DesktopPage'

export default DesktopPage