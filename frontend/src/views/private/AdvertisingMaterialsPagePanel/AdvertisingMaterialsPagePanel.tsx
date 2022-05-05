import React from 'react'
import Helmet from 'react-helmet'
import {Link} from 'react-router-dom'
import classNames from 'classnames/bind'
import {RouteNames} from '../../../routes/routes'
import classes from './AdvertisingMaterialsPagePanel.module.scss'

const cx = classNames.bind(classes)

const AdvertisingMaterialsPagePanel: React.FC = () => {
    const menu = [
        {href: RouteNames.ADVERTISING_PARTNER, title: 'Спонсоры и партнеры', disabled: false},
        {href: RouteNames.ADVERTISING_BANNER, title: 'Баннеры', disabled: false},
        {href: RouteNames.ADVERTISING_WIDGET, title: 'Виджеты', disabled: false}
    ]

    return (
        <main className={classes.BuildingPagePanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Недвижимость - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <h1><span>Рекламные материалы</span></h1>

                <div className={classes.list}>
                    {menu.map(item => {
                        return (
                            <div className={cx({'item': true, 'disabled': item.disabled})}>
                                {item.disabled ? <span>{item.title}</span>
                                    : <Link to={item.href} title={item.title}>{item.title}</Link>}
                            </div>
                        )
                    })}
                </div>
            </div>
        </main>
    )
}

AdvertisingMaterialsPagePanel.displayName = 'AdvertisingMaterialsPagePanel'

export default AdvertisingMaterialsPagePanel