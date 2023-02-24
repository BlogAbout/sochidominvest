import React, {useEffect, useState} from 'react'
import NotificationService from '../../../../api/NotificationService'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import NotificationPanel from '../../../../components/ui/NotificationPanel/NotificationPanel'
import openPopupMessenger from '../../../../components/popup/PopupMessenger/PopupMessenger'
import classes from './ToolsPanel.module.scss'

const ToolsPanel: React.FC = () => {
    const [isShowNotification, setIsShowNotification] = useState(false)
    const [countNewNotification, setCountNewNotification] = useState(0)

    useEffect(() => {
        getCountNewNotification()

        window.events.addListener('messengerCountNotificationsIncrease', countNewNotificationIncrease)
        window.events.addListener('messengerCountNewNotificationUpdate', countNewNotificationUpdate)

        return () => {
            window.events.removeListener('messengerCountNotificationsIncrease', countNewNotificationIncrease)
            window.events.removeListener('messengerCountNewNotificationUpdate', countNewNotificationUpdate)
        }
    }, [countNewNotification])

    // Получение количества новых уведомлений
    const getCountNewNotification = () => {
        NotificationService.fetchCountNewNotifications()
            .then((response: any) => setCountNewNotification(response.data))
            .catch((error: any) => console.error('Ошибка получения количества новых уведомлений', error))
    }

    // Увеличение счетчика количества новых уведомлений
    const countNewNotificationIncrease = () => {
        countNewNotificationUpdate(countNewNotification + 1)
    }

    const countNewNotificationUpdate = (count: number) => {
        setCountNewNotification(count)
    }

    return (
        <>
            <aside className={classes.ToolsPanel}>
                <div className={classes.icon}
                     title='Мессенджер'
                     onClick={() => openPopupMessenger(document.body, {})}
                >
                    <FontAwesomeIcon icon='message'/>
                </div>

                <div className={classes.icon}
                     title='Уведомления'
                     onClick={() => setIsShowNotification(!isShowNotification)}
                >
                    <FontAwesomeIcon icon='bell'/>

                    {countNewNotification > 0 ? <div className={classes.counter}>{countNewNotification}</div> : null}
                </div>
            </aside>

            {isShowNotification &&
            <NotificationPanel isShow={isShowNotification} onShow={() => setIsShowNotification(false)}/>}
        </>
    )
}

ToolsPanel.displayName = 'ToolsPanel'

export default ToolsPanel