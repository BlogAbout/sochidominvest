import React from 'react'
import classes from './Document.module.scss'

const Document: React.FC = () => {
    return (
        <main className={classes.Document}>
            <div className={classes.Content}>
                <h1>
                    <span>Документы</span>
                </h1>
            </div>
        </main>
    )
}

Document.displayName = 'Document'

export default Document