import React, {useState} from 'react'
import {IMailing} from '../../../../../@types/IMailing'
import {getMailingStatusText, getMailingTypeText} from '../../../../../helpers/mailingHelper'
import {allowForRole} from '../../../../helpers/accessHelper'
import MailingService from '../../../../../api/MailingService'
import ListHead from '../../../../components/ui/List/components/ListHead/ListHead'
import ListCell from '../../../../components/ui/List/components/ListCell/ListCell'
import ListBody from '../../../../components/ui/List/components/ListBody/ListBody'
import ListRow from '../../../../components/ui/List/components/ListRow/ListRow'
import List from '../../../../components/ui/List/List'
import Empty from '../../../../components/ui/Empty/Empty'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import openPopupMailingInfo from '../../../../../components/popup/PopupMailingInfo/PopupMailingInfo'
import openPopupMailingCreate from '../../../../../components/popup/PopupMailingCreate/PopupMailingCreate'
import classes from './MailingList.module.scss'

interface Props {
    list: IMailing[]
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onSave: () => {
        console.info('MailingList onSave')
    }
}

const MailingList: React.FC<Props> = (props): React.ReactElement => {
    const [fetching, setFetching] = useState(props.fetching)

    // Редактирование
    const onEditHandler = (mailing: IMailing) => {
        openPopupMailingCreate(document.body, {
            mailing: mailing,
            onSave: () => props.onSave()
        })
    }

    // Удаление
    const onRemoveHandler = (mailing: IMailing) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить "${mailing.name}"?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (mailing.id) {
                            setFetching(true)

                            MailingService.removeMailing(mailing.id)
                                .then(() => {
                                    props.onSave()
                                })
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data
                                    })
                                })
                                .finally(() => {
                                    setFetching(false)
                                })
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    const onRunHandler = (mailing: IMailing, isRun = false) => {
        const updateMailing: IMailing = {...mailing}
        updateMailing.status = isRun ? 1 : 0

        setFetching(true)

        MailingService.saveMailing(updateMailing)
            .then((response: any) => {
                props.onSave()

                const newMailing: IMailing = response.data
                if (newMailing.status === 1) {
                    openPopupAlert(document.body, {
                        title: 'Рассылка запущена',
                        text: 'Рассылка успешно запущена. Отправка сообщений будет происходит автоматически, без Вашего участия.'
                    })
                }
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })

            })
            .finally(() => {
                setFetching(false)
            })
    }

    // Контекстное меню
    const onContextMenuHandler = (mailing: IMailing, e: React.MouseEvent) => {
        e.preventDefault()

        if (allowForRole(['director', 'administrator', 'manager'])) {
            const menuItems = [
                {
                    text: 'Редактировать',
                    onClick: () => onEditHandler(mailing)
                },
                {
                    text: 'Удалить',
                    onClick: () => onRemoveHandler(mailing)
                }
            ]

            if (mailing.status === 1) {
                menuItems.unshift({
                    text: 'Остановить',
                    onClick: () => onRunHandler(mailing, false)
                })
            } else if (mailing.status === 0) {
                menuItems.unshift({
                    text: 'Запустить',
                    onClick: () => onRunHandler(mailing, true)
                })
            }

            openContextMenu(e, menuItems)
        }
    }

    return (
        <List className={classes.MailingList}>
            <ListHead>
                <ListCell className={classes.name}>Название</ListCell>
                <ListCell className={classes.type}>Тип</ListCell>
                <ListCell className={classes.status}>Состояние</ListCell>
                <ListCell className={classes.count}>Получатели</ListCell>
            </ListHead>

            <ListBody fetching={props.fetching || fetching}>
                {props.list && props.list.length ?
                    props.list.map((mailing: IMailing) => {
                        return (
                            <ListRow key={mailing.id}
                                     onContextMenu={(e: React.MouseEvent) => onContextMenuHandler(mailing, e)}
                                     onClick={() => openPopupMailingInfo(document.body, {
                                         mailing: mailing
                                     })}
                                     isDisabled={!mailing.active}
                            >
                                <ListCell className={classes.name}>{mailing.name}</ListCell>
                                <ListCell className={classes.type}>{getMailingTypeText(mailing.type)}</ListCell>
                                <ListCell className={classes.status}>{getMailingStatusText(mailing.status)}</ListCell>
                                <ListCell className={classes.count}>{mailing.countRecipients}</ListCell>
                            </ListRow>
                        )
                    })
                    : <Empty message='Нет рассылок'/>
                }
            </ListBody>
        </List>
    )
}

MailingList.defaultProps = defaultProps
MailingList.displayName = 'MailingList'

export default React.memo(MailingList)