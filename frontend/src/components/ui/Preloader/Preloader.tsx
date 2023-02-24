import React from 'react'
import classes from './Preloader.module.scss'

const Preloader: React.FC = () => {
    return (
        <div className={classes['background']}>
        <div className={classes.roller}>
            <div/>
            <div/>
            <div/>
            <div/>
            <div/>
            <div/>
            <div/>
            <div/>
        </div>
        </div>
    )
}

export default Preloader