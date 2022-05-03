import React from 'react'
import Helmet from 'react-helmet'
import classes from './PartnerPanel.module.scss'

const PartnerPanel: React.FC = () => {
    return (
        <main className={classes.PartnerPanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Спонсоры и партнеры - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <h1>
                    <span>Спонсоры и партнеры</span>
                </h1>

                <p style={{marginTop: 20, color: '#fff'}}>Раздел находится в стадии разработки</p>
            </div>
        </main>
    )
}

PartnerPanel.displayName = 'PartnerPanel'

export default PartnerPanel