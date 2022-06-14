import React from 'react'
import {Link} from 'react-router-dom'
import classNames from 'classnames/bind'
import {RouteNames} from '../../../routes/routes'
import PageInfo from '../../../components/ui/PageInfo/PageInfo'
import Title from '../../../components/ui/Title/Title'
import classes from './AdvertisingMaterialsPagePanel.module.scss'

const cx = classNames.bind(classes)

const AdvertisingMaterialsPagePanel: React.FC = () => {
    const menu = [
        {href: RouteNames.ADVERTISING_PARTNER, title: 'Спонсоры и партнеры', disabled: false},
        {href: RouteNames.ADVERTISING_BANNER, title: 'Баннеры', disabled: false},
        {href: RouteNames.ADVERTISING_WIDGET, title: 'Виджеты', disabled: false},
        {href: RouteNames.ADVERTISING_FAQ, title: 'F.A.Q.', disabled: false}
    ]

    return (
        <main className={classes.AdvertisingMaterialsPagePanel}>
            <PageInfo title='Рекламные материалы'/>

            <div className={classes.Content}>
                <Title type={1}>Рекламные материалы</Title>

                <div className={classes.list}>
                    {menu.map(item => {
                        return (
                            <div key={item.href} className={cx({'item': true, 'disabled': item.disabled})}>
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