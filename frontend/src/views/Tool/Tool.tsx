import React from 'react'
import Helmet from 'react-helmet'
import classes from './Tool.module.scss'

const Tool: React.FC = () => {
    return (
        <main className={classes.Tool}>
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

Tool.displayName = 'Tool'

export default Tool