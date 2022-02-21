import React from 'react'
import classes from './HeadPanel.module.scss'

const HeadPanel: React.FC = () => {
    return (
        <section className={classes.HeadPanel}>
            <div className={classes.container}>
                <div className={classes.logo}>
                    <div className={classes.logoImage}/>
                </div>

                <div className={classes.contacts}>
                    <a href='tel:+79186053427' className={classes.phone}>+7 (918) 605-34-27</a>
                    <a href='mailto:info@sochidominvest.ru' className={classes.email}>info@sochidominvest.ru</a>
                </div>
            </div>
        </section>
    )
}

HeadPanel.displayName = 'HeadPanel'

export default HeadPanel