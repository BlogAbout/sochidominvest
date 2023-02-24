import React, {useMemo, useState} from 'react'
import classNames from 'classnames/bind'
import {ITab} from '../../../@types/ITab'
import TabsHeader from './components/TabsHeader/TabsHeader'
import classes from './Tabs.module.scss'

interface Props {
    tabs: ITab
    paddingFirstTab: 'none' | 'popup'
    showCount?: boolean // Вывод кол-ва в шапке таба
    bottom?: boolean // Расположение вкладок снизу от содержимого
    error?: string[] // Список названий вкладок у которых есть ошибки

    onClick?(tabKey: string): void
}

const defaultProps: Props = {
    tabs: {} as ITab,
    paddingFirstTab: 'none',
    showCount: false,
    bottom: false,
    error: []
}

const cx = classNames.bind(classes)

const Tabs: React.FC<Props> = (props) => {
    const [tab, setTab] = useState(Object.keys(props.tabs)[0])

    useMemo(() => {
        if (!props.tabs[tab]) {
            const currentTab = Object.keys(props.tabs)[0]
            setTab(currentTab)
        }
    }, [props.tabs, tab])

    const error = props.error && props.error.includes(tab)
    const tabsStyle = cx({
        'wrapper': true,
        'bottom': props.bottom,
        'top': !props.bottom,
        'error_tabs': error,
    })
    const content = (
        <div className={classes.content}>
            {tab && props.tabs[tab] ? props.tabs[tab].render : null}
        </div>
    )

    return (
        <div className={tabsStyle}>
            {props.bottom ? content : null}

            <TabsHeader
                showCount={props.showCount}
                currentTab={tab}
                error={props.error}
                activeTab={tabKey => {
                    if (props.onClick) {
                        props.onClick(tabKey)
                    }

                    setTab(tabKey)
                }}
                paddingFirstTab={props.paddingFirstTab}
                tabs={props.tabs}
            />

            {!props.bottom ? content : null}
        </div>
    )
}

Tabs.defaultProps = defaultProps
Tabs.displayName = 'Tabs'

export default Tabs