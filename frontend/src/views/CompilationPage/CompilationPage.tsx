import React from 'react'
import Helmet from 'react-helmet'
import classes from './CompilationPage.module.scss'

const CompilationPage: React.FC = () => {
    return (
        <main className={classes.Document}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Подборка - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <h1>
                    <span>Подборка</span>
                </h1>
            </div>
        </main>
    )
}

CompilationPage.displayName = 'CompilationPage'

export default CompilationPage