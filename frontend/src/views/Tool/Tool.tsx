import React from 'react'
import classes from './Tool.module.scss'

const Tool: React.FC = () => {
    return (
        <main className={classes.Tool}>
            <div className={classes.Content}>
                <h1>Инструменты</h1>
            </div>
        </main>
    )
}

Tool.displayName = 'Tool'

export default Tool