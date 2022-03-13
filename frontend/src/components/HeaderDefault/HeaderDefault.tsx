import React from 'react'
import {Link} from "react-router-dom";
import {RouteNames} from '../../routes/routes'
import classes from './HeaderDefault.module.scss'

const HeaderDefault: React.FC = () => {
    return (
        <div className={classes.HeaderDefault}>
            <div className={classes.container}>
                <div className={classes.block}>
                    <Link to={RouteNames.MAIN} className={classes.logo}>
                        <span className={classes.logoImage}/>
                    </Link>

                    <div className={classes.contacts}>
                        <a href='tel:+79186053427' className={classes.phone}>+7 (918) 605-34-27</a>
                        <a href='mailto:info@sochidominvest.ru' className={classes.email}>info@sochidominvest.ru</a>
                    </div>
                </div>

                <div className={classes.block}>
                    <div className={classes.slogan}>
                        <h1>Платформа недвижимости Сочи</h1>
                        <div>для агентов и агентств недвижимости</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

HeaderDefault.displayName = 'HeaderDefault'

export default HeaderDefault