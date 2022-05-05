import React from 'react'
import Helmet from 'react-helmet'
import classes from './ToolPanel.module.scss'

const ToolPanel: React.FC = () => {
    return (
        <main className={classes.ToolPanel}>
            <Helmet>
                <meta charSet='utf-8'/>
                <title>Инструменты - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <h1>
                    <span>Инструменты</span>
                </h1>

                <p style={{marginTop: 20, color: '#fff'}}>Раздел находится в стадии разработки</p>
            </div>
        </main>
    )
}

ToolPanel.displayName = 'ToolPanel'

export default ToolPanel