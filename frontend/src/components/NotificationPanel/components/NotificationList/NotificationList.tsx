import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useActions} from '../../../../hooks/useActions'
import {INotification} from '../../../../@types/INotification'
import BlockingElement from '../../../BlockingElement/BlockingElement'
import Empty from '../../../Empty/Empty'
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
                {props.notifications.map((notification: INotification) =>
                    <div key={notification.id} className={classes.item}>
                        <div className={classes.row}>
                            <div className={classes.date}>{notification.dateCreated}</div>

                            {notification.status === 'new' ?
                                <div className={classes.btn}
                                     onClick={() => onReadMessageHandler(notification)}
                                     title='Отметить как прочитанное'
                                >
                                    <FontAwesomeIcon icon='envelope'/>
                                </div>
                                : null
                            }

                            <div className={classes.btn}
                                 onClick={() => onRemoveMessageHandler(notification)}
                                 title='Удалить'
                            >
                                <FontAwesomeIcon icon='trash'/>
                            </div>
                        </div>

                        <div className={classes.title}>{notification.name}</div>

                        {notification.description ?
                            <div className={classes.description}>{notification.description}</div>
                            : null
                        }
                    </div>
                )}
            </BlockingElement>
        )
    } else {
        return <Empty message='Нет уведомлений для отображения'/>
    }
}

NotificationList.defaultProps = defaultProps
NotificationList.displayName = 'NotificationList'

export default NotificationList