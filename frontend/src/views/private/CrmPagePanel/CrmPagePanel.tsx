import React from 'react'
import {Link} from 'react-router-dom'
import classNames from 'classnames/bind'
import {RouteNames} from '../../../routes/routes'
import PageInfo from '../../../components/ui/PageInfo/PageInfo'
import Title from '../../../components/ui/Title/Title'
import classes from './CrmPagePanel.module.scss'

const cx = classNames.bind(classes)

const CrmPagePanel: React.FC = () => {
    const menu = [
        {href: RouteNames.CRM_DEVELOPER, title: 'Застройщики', disabled: false},
        {href: RouteNames.CRM_POST, title: 'Должности', disabled: false},
        {href: RouteNames.CRM_BP, title: 'Бизнес-процессы', disabled: false},
        {href: RouteNames.CRM_BOOKING, title: 'Бронирование', disabled: false}
    ]

    return (
        <main className={classes.CrmPagePanel}>
            <PageInfo title='CRM'/>

            <div className={classes.Content}>
                <Title type={1}>CRM</Title>

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

CrmPagePanel.displayName = 'CrmPagePanel'

export default CrmPagePanel