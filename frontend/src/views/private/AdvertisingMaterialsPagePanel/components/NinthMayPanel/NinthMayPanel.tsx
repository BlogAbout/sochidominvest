import React from 'react'
import Helmet from 'react-helmet'
import classes from './NinthMayPanel.module.scss'

const NinthMayPanel: React.FC = () => {
    return (
        <main className={classes.NinthMayPanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Управление материалами - 9 Мая - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <h1>
                    <span>Управление материалами - 9 Мая</span>
                </h1>

                <p style={{marginTop: 20, color: '#fff'}}>Раздел находится в стадии разработки</p>
            </div>
        </main>
    )
}

NinthMayPanel.displayName = 'NinthMayPanel'

export default NinthMayPanel