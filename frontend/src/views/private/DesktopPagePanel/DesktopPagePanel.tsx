import React from 'react'
import Helmet from 'react-helmet'
import classes from './DesktopPagePanel.module.scss'

const DesktopPagePanel: React.FC = () => {
    return (
        <div className={classes.DesktopPagePanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Рабочий стол - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <p style={{marginTop: 20, color: '#fff'}}>Раздел находится в стадии разработки</p>
        </div>
    )
}

DesktopPagePanel.displayName = 'DesktopPagePanel'

export default DesktopPagePanel