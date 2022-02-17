import React from 'react'
import classes from './Preloader.module.css'

const Preloader: React.FC = () => {
    return (
        <div className={classes['background']}>
            <div className={classes['spinner']}>
                <div className={classes['bounce1']}/>
                <div className={classes['bounce2']}/>
                <div/>
            </div>
        </div>
    )
}

export default Preloader