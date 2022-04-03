import React from 'react'
import Helmet from 'react-helmet'
import classes from './Report.module.scss'

const Report: React.FC = () => {
    return (
        <main className={classes.Report}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Отчеты - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <h1>Отчеты</h1>
            </div>
        </main>
    )
}

Report.displayName = 'Report'

export default Report