import React, {useEffect, useState} from 'react'
import classNames from 'classnames/bind'
import NotificationService from '../../../api/NotificationService'
import {PopupProps} from '../../../@types/IPopup'
import {INotification} from '../../../@types/INotification'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import TextBox from '../../form/TextBox/TextBox'
import Button from '../../form/Button/Button'
import TextAreaBox from '../../form/TextAreaBox/TextAreaBox'
import Title from '../../ui/Title/Title'
import Label from '../../form/Label/Label'
import classes from './PopupNotificationCreate.module.scss'

interface Props extends PopupProps {
    onSave(): void
}

const defaultProps: Props = {
    onSave: () => {
        console.info('PopupNotificationCreate onSave')
    }
}

const cx = classNames.bind(classes)

const PopupNotificationCreate: React.FC<Props> = (props) => {
    const [notification, setNotification] = useState<INotification>({
        id: null,
        name: '',
        description: '',
        type: 'system',
        active: 1
    })

    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    const onSaveHandler = () => {
        if (notification.name.trim() === '') {
            return
        }

        setFetching(true)

        NotificationService.saveNotification(notification)
            .then(() => {
                props.onSave()
                close()
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })
            })
            .finally(() => setFetching(false))
    }

    return (
        <Popup className={classes.PopupNotificationCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>Создание нового системного уведомления</Title>

                    <div className={classes.field}>
                        <Label text='Заголовок'/>

                        <TextBox value={notification.name}
                                 onChange={(e: React.MouseEvent, value: string) => setNotification({
                                     ...notification,
                                     name: value
                                 })}
                                 placeHolder='Введите заголовок'
                                 error={notification.name.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 styleType='minimal'
                        />
                    </div>

                    <div className={cx({'field': true, 'fieldWrap': true})}>
                        <Label text='Описание'/>

                        <TextAreaBox value={notification.description || ''}
                                     onChange={(value: string) => setNotification({
                                         ...notification,
                                         description: value
                                     })}
                                     placeHolder='Введите описание'
                                     width='100%'
                        />
                    </div>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='apply'
                        icon='check'
                        onClick={() => onSaveHandler()}
                        disabled={fetching || notification.name.trim() === ''}
                        title='Сохранить'
                >Создать</Button>

                <Button type='regular'
                        icon='arrow-rotate-left'
                        onClick={close.bind(this)}
                        className='marginLeft'
                        title='Отменить'
                >Отменить</Button>
            </Footer>
        </Popup>
    )
}

PopupNotificationCreate.defaultProps = defaultProps
PopupNotificationCreate.displayName = 'PopupNotificationCreate'

export default function openPopupNotificationCreate(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupNotificationCreate, popupProps, undefined, block, displayOptions)
}