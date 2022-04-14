import React, {useEffect, useRef, useState} from 'react'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import {useActions} from '../../hooks/useActions'
import {INotification} from '../../@types/INotification'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import Button from '../Button/Button'
import Empty from '../Empty/Empty'
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

    const [isUpdate, setIsUpdate] = useState(false)
    const [countNotification, setCountNotification] = useState(0)
    const [selectedType, setSelectedType] = useState('new')

    const {role} = useTypedSelector(state => state.userReducer)
    const {notifications, fetching} = useTypedSelector(state => state.notificationReducer)
    const {fetchNotificationList, readNotificationAll} = useActions()

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true)

        return () => {
            document.removeEventListener('click', handleClickOutside, true)
        }
    }, [])

    useEffect(() => {
        if (isUpdate || !notifications.length) {
            fetchNotificationList()
        }
    }, [isUpdate])

    useEffect(() => {
        if (notifications.length) {
            setCountNotification(notifications.filter((notification: INotification) => notification.status === 'new').length)
        } else {
            setCountNotification(0)
        }
    }, [notifications])

    // Обработка клика вне блока
    const handleClickOutside = (event: Event): void => {
        if (refDepartmentItem.current && event.target && !refDepartmentItem.current.contains(event.target as Node)) {
            props.onShow()
        }
    }

    return (
        <div className={classes.NotificationPanel} ref={refDepartmentItem}>
            <Header title={'Уведомления' + (countNotification > 0 ? `(${countNotification})` : '')}
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

                {notifications && notifications.length ?
                    <BlockingElement fetching={fetching} className={classes.content}>

                    </BlockingElement>
                    : <Empty message='Нет уведомлений для отображения'/>
                }
            </Content>

            {['director', 'administrator', 'manager'].includes(role) || countNotification > 0 ?
                <Footer>
                    {['director', 'administrator', 'manager'].includes(role) &&
                    <Button type='save'
                            icon='plus'
                            onClick={() => readNotificationAll()}
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