import React from 'react'
import Helmet from 'react-helmet'
import classes from './BannerPanel.module.scss'

const BannerPanel: React.FC = () => {
    return (
        <main className={classes.BannerPanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Баннеры - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <h1>
                    <span>Баннеры</span>
                </h1>

                <p style={{marginTop: 20, color: '#fff'}}>Раздел находится в стадии разработки</p>
            </div>
        </main>
    )
}

BannerPanel.displayName = 'BannerPanel'

export default BannerPanel