import React, {useEffect, useRef, useState} from 'react'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {INotification} from '../../../@types/INotification'
import {Content, Footer, Header} from '../../popup/Popup/Popup'
import Button from '../../form/Button/Button'
import NotificationList from './components/NotificationList/NotificationList'
import openPopupNotificationCreate from '../../popup/PopupNotificationCreate/PopupNotificationCreate'
import classes from './NotificationPanel.module.scss'

interface Props {
    isShow: boolean

    onShow(): void
}

const defaultProps: Props = {
    isShow: false,
    onShow: () => {
        console.info('NotificationPanel onShow')
    }
}

const NotificationPanel: React.FC<Props> = (props) => {
    const refDepartmentItem = useRef<HTMLDivElement>(null)

    const [isUpdate, setIsUpdate] = useState(true)
    const [countNotification, setCountNotification] = useState(0)
    const [selectedType, setSelectedType] = useState('new')
    const [filteredNotification, setFilteredNotification] = useState<INotification[]>([])

    const {role} = useTypedSelector(state => state.userReducer)
    const {notifications, fetching} = useTypedSelector(state => state.notificationReducer)
    const {fetchNotificationList, readNotificationAll} = useActions()

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true)
        window.events.addListener('messengerNewNotification', updateNotificationHandler)

        return () => {
            document.removeEventListener('click', handleClickOutside, true)
            window.events.removeListener('messengerNewNotification', updateNotificationHandler)
        }
    }, [])

    useEffect(() => {
        if (isUpdate || !notifications.length) {
            filter()
            fetchNotificationList()
        }

        setIsUpdate(false)
    }, [isUpdate])

    useEffect(() => {
        filter()
        updateCountNewNotification()
    }, [notifications, selectedType])

    const updateNotificationHandler = () => {
        setIsUpdate(true)
    }

    const updateCountNewNotification = () => {
        let countNew = 0

        if (notifications.length) {
            countNew = notifications.filter((notification: INotification) => notification.status === 'new').length
        }

        setCountNotification(countNew)
        window.events.emit('messengerCountNewNotificationUpdate', countNew)
    }

    const filter = () => {
        if (!notifications || !notifications.length) {
            setFilteredNotification([])

            return
        }

        switch (selectedType) {
            case 'all':
                setFilteredNotification(notifications)
                break
            case 'new':
                setFilteredNotification(notifications.filter((notification: INotification) => notification.status === 'new'))
                break
            case 'system':
                setFilteredNotification(notifications.filter((notification: INotification) => ['system', 'feed'].includes(notification.type) ))
                break
            default:
                setFilteredNotification([])
                break
        }
    }

    // Обработка клика вне блока
    const handleClickOutside = (event: Event): void => {
        if (refDepartmentItem.current && event.target && !refDepartmentItem.current.contains(event.target as Node)) {
            props.onShow()
        }
    }

    return (
        <div className={classes.NotificationPanel} ref={refDepartmentItem}>
            <Header title={'Уведомления' + (countNotification > 0 ? ` (${countNotification})` : '')}
                    popupId=''
                    onClose={() => props.onShow()}
            />

            <Content className={classes.popupContent}>
                <div className={classes.filter}>
                    <Button type={selectedType.includes('all') ? 'regular' : 'save'}
                            icon='border-all'
                            onClick={() => setSelectedType('all')}
                            title='Все'
                    />

                    <Button type={selectedType.includes('new') ? 'regular' : 'save'}
                            icon='calendar-plus'
                            onClick={() => setSelectedType('new')}
                            title='Новые'
                    />

                    <Button type={selectedType.includes('system') ? 'regular' : 'save'}
                            icon='database'
                            onClick={() => setSelectedType('system')}
                            title='Системные'
                    />

                    <Button type={selectedType.includes('update') ? 'regular' : 'save'}
                            icon='pen-to-square'
                            onClick={() => setSelectedType('update')}
                            title='Обновления'
                    />

                    <Button type={selectedType.includes('other') ? 'regular' : 'save'}
                            icon='star'
                            onClick={() => setSelectedType('other')}
                            title='Другое'
                    />
                </div>

                <NotificationList notifications={filteredNotification} fetching={fetching}/>
            </Content>

            {['director', 'administrator', 'manager'].includes(role) || countNotification > 0 ?
                <Footer>
                    {['director', 'administrator', 'manager'].includes(role) &&
                    <Button type='save'
                            icon='plus'
                            onClick={() => {
                                openPopupNotificationCreate(document.body, {
                                    onSave: () => {
                                        setIsUpdate(true)
                                    }
                                })
                            }}
                            disabled={fetching}
                    >Создать</Button>}

                    {countNotification > 0 &&
                    <Button type='apply'
                            icon='check'
                            onClick={() => readNotificationAll()}
                            disabled={fetching}
                            className='marginLeft'
                    >Прочитать все</Button>}
                </Footer>
                : null
            }
        </div>
    )
}

NotificationPanel.defaultProps = defaultProps
NotificationPanel.displayName = 'NotificationPanel'

export default NotificationPanel