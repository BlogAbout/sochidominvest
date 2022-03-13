import React from 'react'
import classes from './CompilationPage.module.scss'

const CompilationPage: React.FC = () => {
    return (
        <main className={classes.Document}>
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