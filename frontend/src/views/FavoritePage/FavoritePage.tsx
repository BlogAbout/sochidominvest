import React from 'react'
import classes from './FavoritePage.module.scss'

const FavoritePage: React.FC = () => {
    return (
        <main className={classes.Document}>
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