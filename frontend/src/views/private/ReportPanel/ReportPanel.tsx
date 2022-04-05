import React from 'react'
import Helmet from 'react-helmet'
import classes from './ReportPanel.module.scss'

const ReportPanel: React.FC = () => {
    return (
        <main className={classes.ReportPanel}>
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

ReportPanel.displayName = 'ReportPanel'

export default ReportPanel