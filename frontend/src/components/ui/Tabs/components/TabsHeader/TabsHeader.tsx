import React from 'react'
import classNames from 'classnames/bind'
import {ITab} from '../../../../../@types/ITab'
import styles from '../../Tabs.module.scss'

interface Props {
    tabs: ITab
    paddingFirstTab: 'none' | 'popup'
    currentTab?: string
    showCount?: boolean
    error?: string[]

    activeTab(tabKey: string): void
}

const defaultProps: Props = {
    tabs: {} as ITab,
    paddingFirstTab: 'none',
    showCount: false,
    error: [],
    activeTab: (tabKey: string) => {
        console.info('TabsHeader activeTab', tabKey)
    }
}

const cx = classNames.bind(styles)

const TabsHeader: React.FC<Props> = (props) => {
    const tabs = Object.keys(props.tabs).map((tabKey, index) => {
        const tab = props.tabs[tabKey]
        const count = tab.count || 0
        const active = props.currentTab === tabKey
        const error = props.error && props.error.includes(tabKey)
        const tabStyle = cx({
            'tab': !active,
            'active': active,
            'error': error,
            'icon': tab.icon,
            'icon-count': count > 0,
            [tab.icon ? tab.icon : '']: tab.icon && !active,
            [tab.iconActive ? tab.iconActive : '']: tab.iconActive && active
        })

        let marginLeft = 6

        // Todo
        // if (index === 0) {
        //     if (props.paddingFirstTab === 'none') {
        //         marginLeft = 0
        //     }
        //
        //     if (props.paddingFirstTab === 'popup') {
        //         marginLeft = 15
        //     }
        // }

        return (
            <div key={tabKey}
                 className={tabStyle}
                 onClick={() => props.activeTab(tabKey)}
                 title={tab.title}
                 placeholder={tab.icon ? '' : tab.title}
            >
                {!tab.icon ? <span>{tab.title}</span> : <span className={styles['title-empty']}/>}

                {count > 0 ? <div title={count > 99 ? count.toString() : ''}
                                  className={styles['count']}>{count > 99 ? '99+' : count}</div> : null
                }
            </div>
        )
    })

    return (
        <div className={styles['tabs']}>{tabs}</div>
    )
}

TabsHeader.defaultProps = defaultProps
TabsHeader.displayName = 'TabsHeader'

export default TabsHeader