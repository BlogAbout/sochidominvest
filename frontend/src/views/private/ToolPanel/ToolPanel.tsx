import React from 'react'
import Helmet from 'react-helmet'
import classes from './ToolPanel.module.scss'

const ToolPanel: React.FC = () => {
    return (
        <main className={classes.ToolPanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Инструменты - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <h1>Инструменты</h1>
            </div>
        </main>
    )
}

ToolPanel.displayName = 'ToolPanel'

export default ToolPanel