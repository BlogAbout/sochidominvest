import React from 'react'
import classes from './Report.module.scss'

const Report: React.FC = () => {
    return (
        <main className={classes.Report}>
            <div className={classes.Content}>
                <h1>Отчеты</h1>
            </div>
        </main>
    )
}

Report.displayName = 'Report'

export default Report