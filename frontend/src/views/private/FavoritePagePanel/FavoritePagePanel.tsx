import React from 'react'
import Helmet from 'react-helmet'
import classes from './FavoritePagePanel.module.scss'

const FavoritePagePanel: React.FC = () => {
    return (
        <main className={classes.FavoritePagePanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Избранное - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <h1>
                    <span>Избранное</span>
                </h1>
            </div>
        </main>
    )
}

FavoritePagePanel.displayName = 'FavoritePagePanel'

export default FavoritePagePanel