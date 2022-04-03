import React from 'react'
import Helmet from 'react-helmet'
import classes from './FavoritePage.module.scss'

const FavoritePage: React.FC = () => {
    return (
        <main className={classes.Document}>
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

FavoritePage.displayName = 'FavoritePage'

export default FavoritePage