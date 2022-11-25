import React, {useEffect, useState} from 'react'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IMailing, IMailingRecipient} from '../../../@types/IMailing'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import MailingService from '../../../api/MailingService'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Button from '../../form/Button/Button'
import Title from '../../ui/Title/Title'
import RecipientList from './components/RecipientList/RecipientList'
import classes from './PopupMailingInfo.module.scss'

interface Props extends PopupProps {
    mailing: IMailing
}

const defaultProps: Props = {
    mailing: {} as IMailing
}

const PopupMailingInfo: React.FC<Props> = (props) => {
    const [fetching, setFetching] = useState(false)
    const [recipients, setRecipients] = useState<IMailingRecipient[]>([])

    useEffect(() => {
        fetchRecipients()

        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    const fetchRecipients = () => {
        if (props.mailing.id) {
            setFetching(true)

            MailingService.fetchMailingById(props.mailing.id)
                .then((response: any) => {
                    setRecipients(response.data)
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

    const onRemoveHandler = (recipient: IMailingRecipient) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${recipient.email} из списка выбранных?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        MailingService.removeMailingRecipient(recipient)
                            .then(() => {
                                const updateListRecipients: IMailingRecipient[] = recipients.filter((item: IMailingRecipient) => {
                                    return !(item.mailingId === recipient.mailingId && item.userType === recipient.userType && item.userId === recipient.userId)
                                })

                                setRecipients(updateListRecipients)
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
                },
                {text: 'Отмена'}
            ]
        })
    }

    return (
        <Popup className={classes.PopupMailingInfo}>
            <BlockingElement fetching={false} className={classes.content}>
                <div key='content' className={classes.blockContent}>
                    <Title type={3}>Список получателей</Title>

                    <RecipientList list={recipients}
                                   fetching={fetching}
                                   onRemove={(recipient: IMailingRecipient) => onRemoveHandler(recipient)}
                    />
                </div>
            </BlockingElement>

            <Footer>
                <Button type='regular'
                        icon='xmark'
                        onClick={close.bind(this)}
                        title='Закрыть'
                >Закрыть</Button>
            </Footer>
        </Popup>
    )
}

PopupMailingInfo.defaultProps = defaultProps
PopupMailingInfo.displayName = 'PopupMailingInfo'

export default function openPopupMailingInfo(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupMailingInfo, popupProps, undefined, block, displayOptions)
}