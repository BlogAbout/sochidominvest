import React from 'react'
import {useActions} from '../../../../../hooks/useActions'
import {INotification} from '../../../../../@types/INotification'
import BlockingElement from '../../../BlockingElement/BlockingElement'
import Empty from '../../../Empty/Empty'
import NotificationItem from '../NotificationItem/NotificationItem'
import classes from './NotificationList.module.scss'

interface Props {
    notifications: INotification[]
    fetching: boolean
}

const defaultProps: Props = {
    notifications: [],
    fetching: false
}

const NotificationList: React.FC<Props> = (props) => {
    const {readNotification, removeNotification} = useActions()

    const onReadMessageHandler = (notification: INotification) => {
        if (notification.id) {
            readNotification(notification.id)
        }
    }

    const onRemoveMessageHandler = (notification: INotification) => {
        if (notification.id) {
            removeNotification(notification.id)
        }
    }

    if (props.notifications && props.notifications.length) {
        return (
            <BlockingElement fetching={props.fetching} className={classes.content}>
                {props.notifications.map((notification: INotification) => {
                    return (
                        <NotificationItem key={notification.id}
                                          notification={notification}
                                          readMessage={onReadMessageHandler.bind(this)}
                                          removeMessage={onRemoveMessageHandler.bind(this)}
                        />
                    )
                })}
            </BlockingElement>
        )
    } else {
        return <Empty message='Нет уведомлений для отображения'/>
    }
}

NotificationList.defaultProps = defaultProps
NotificationList.displayName = 'NotificationList'

export default NotificationList