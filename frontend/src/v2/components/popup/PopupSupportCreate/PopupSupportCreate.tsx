import React, {useEffect, useState} from 'react'
import {PopupDisplayOptions, PopupProps} from '../../../../@types/IPopup'
import {IFeed, IFeedMessage} from '../../../../@types/IFeed'
import FeedService from '../../../../api/FeedService'
import {getPopupContainer, openPopup, removePopup} from '../../../../helpers/popupHelper'
import {Footer, Popup} from '../../../../components/popup/Popup/Popup'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../../../components/PopupAlert/PopupAlert'
import BlockingElement from '../../../../components/ui/BlockingElement/BlockingElement'
import TextBox from '../../form/TextBox/TextBox'
import Button from '../../form/Button/Button'
import TextAreaBox from '../../../../components/form/TextAreaBox/TextAreaBox'
import Title from '../../ui/Title/Title'
import Field from '../../form/Field/Field'
import classes from './PopupSupportCreate.module.scss'

interface Props extends PopupProps {
    objectId?: number | null
    objectType?: string | null

    onSave(): void
}

const defaultProps: Props = {
    objectId: null,
    objectType: null,
    onSave: () => {
        console.info('PopupSupportCreate onSave')
    }
}

const PopupSupportCreate: React.FC<Props> = (props): React.ReactElement => {
    const [feed, setFeed] = useState<IFeed>({
        id: null,
        author: null,
        phone: null,
        name: null,
        title: '',
        type: 'feed',
        objectId: props.objectId || null,
        objectType: props.objectType || null,
        active: 1,
        status: 'new'
    })

    const [message, setMessage] = useState<IFeedMessage>({
        id: null,
        feedId: null,
        author: null,
        active: 1,
        status: 'new',
        content: ''
    })

    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    // Закрытие popup
    const closePopup = () => {
        removePopup(props.id ? props.id : '')
    }

    // Сохранение изменений
    const saveHandler = () => {
        if (feed.title.trim() === '' || message.content.trim() === '') {
            return
        }

        const updateFeed = {...feed, messages: [message]}

        setFetching(true)

        FeedService.saveFeed(updateFeed)
            .then((response: any) => {
                setFetching(false)
                setFeed(response.data)

                props.onSave()
                closePopup()
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })

                setFetching(false)
            })
    }

    return (
        <Popup className={classes.PopupSupportCreate}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type='h2'>Новое обращение</Title>

                    <Field label='Тема'
                           title='Тема'
                           type='hor'
                           style='dark'
                           labelWidth={150}
                    >
                        <TextBox value={feed.title}
                                 onChange={(value: string) => setFeed({
                                     ...feed,
                                     title: value
                                 })}
                                 placeHolder='Введите тему'
                                 error={feed.title.trim() === ''}
                                 showRequired
                                 errorText='Поле обязательно для заполнения'
                                 styleType='minimal'
                                 width='100%'
                        />
                    </Field>

                    <Field label='Сообщение'
                           title='Сообщение'
                           type='vert'
                           style='dark'
                           labelWidth={150}
                    >
                        <TextAreaBox value={message.content}
                                     onChange={(value: string) => setMessage({
                                         ...message,
                                         content: value
                                     })}
                                     placeHolder='Введите текст сообщения'
                                     width='100%'
                        />
                    </Field>
                </div>
            </BlockingElement>

            <Footer>
                <Button type='apply'
                        icon='check'
                        onClick={() => saveHandler()}
                        disabled={fetching || feed.title.trim() === '' || message.content.trim() === ''}
                        title='Отправить'
                >Отправить</Button>

                <Button type='regular'
                        icon='arrow-rotate-left'
                        onClick={closePopup.bind(this)}
                        className='marginLeft'
                        title='Отменить'
                >Отменить</Button>
            </Footer>
        </Popup>
    )
}

PopupSupportCreate.defaultProps = defaultProps
PopupSupportCreate.displayName = 'PopupSupportCreate'

export default function openPopupSupportCreate(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(PopupSupportCreate, popupProps, undefined, block, displayOptions)
}