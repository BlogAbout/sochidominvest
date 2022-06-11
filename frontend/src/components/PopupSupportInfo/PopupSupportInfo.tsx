import React, {useEffect, useState} from 'react'
import {PopupProps} from '../../@types/IPopup'
import {IFeed, IFeedMessage} from '../../@types/IFeed'
import {ISelector} from '../../@types/ISelector'
import {feedStatuses, feedTypes, objectTypes} from '../../helpers/supportHelper'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import FeedService from '../../api/FeedService'
import BuildingService from '../../api/BuildingService'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import showBackgroundBlock from '../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {Content, Footer, Header, Popup} from '../popup/Popup/Popup'
import BlockingElement from '../ui/BlockingElement/BlockingElement'
import Button from '../form/Button/Button'
import Empty from '../Empty/Empty'
import TextAreaBox from '../form/TextAreaBox/TextAreaBox'
import withStore from '../../hoc/withStore'
import StatusBox from '../StatusBox/StatusBox'
import classes from './PopupSupportInfo.module.scss'

interface Props extends PopupProps {
    feedId: number | null

    onSave(): void
}

const defaultProps: Props = {
    feedId: null,
    onSave: () => {
        console.info('PopupSupportInfo onSave')
    }
}

const PopupSupportInfo: React.FC<Props> = (props) => {
    const [feed, setFeed] = useState<IFeed>({
        id: null,
        author: null,
        phone: null,
        name: null,
        title: '',
        type: 'feed',
        objectId: null,
        objectType: null,
        active: 1,
        status: 'new',
        messages: []
    })

    const [message, setMessage] = useState<IFeedMessage>({
        id: null,
        feedId: null,
        author: null,
        active: 1,
        status: 'new',
        content: ''
    })

    const [info, setInfo] = useState({
        objectName: ''
    })

    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [props.blockId])

    useEffect(() => {
        if (props.feedId) {
            setFetching(true)

            FeedService.fetchFeedById(props.feedId)
                .then((response: any) => {
                    setFeed(response.data)
                })
                .catch((error: any) => {
                    console.error('Ошибка загрузки данных!', error)
                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data
                    })
                })
                .finally(() => {
                    setFetching(false)
                })
        }
    }, [props.feedId])

    useEffect(() => {
        if (feed.objectId && feed.objectType) {
            if (feed.objectType === 'building') {
                BuildingService.fetchBuildingById(feed.objectId)
                    .then((response: any) => {
                        setInfo({...info, objectName: response.data.name})
                    })
                    .catch((error: any) => {
                        openPopupAlert(document.body, {
                            title: 'Ошибка!',
                            text: error.data
                        })
                    })
            }
        }
    }, [feed.objectId])

    // Закрытие popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Сохранение изменений
    const saveHandler = (status: string) => {
        const updateFeed: IFeed = {...feed, status: status}

        setFetching(true)

        FeedService.saveFeed(updateFeed)
            .then((response: any) => {
                setFeed(response.data)

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

    const saveMessage = () => {
        if (message.content.trim() === '') {
            return
        }

        const updateFeed = {...feed, messages: [message]}

        setFetching(true)

        FeedService.saveFeed(updateFeed)
            .then((response: any) => {
                setFetching(false)
                setFeed(response.data)
                setMessage({
                    id: null,
                    feedId: null,
                    author: null,
                    active: 1,
                    status: 'new',
                    content: ''
                })

                props.onSave()
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })

                setFetching(false)
            })
    }

    const feedType = feedTypes.find((type: ISelector) => type.key === feed.type)
    const objectType = objectTypes.find((type: ISelector) => type.key === feed.objectType)

    const items = feedStatuses.map((item: ISelector) => {
        return {
            title: item.text,
            text: item.key,
            onClick: () => {
                saveHandler(item.key)
            }
        }
    })

    const renderMessage = (message: IFeedMessage) => {
        return (
            <div key={message.id} className={classes.item}>
                <div className={classes.head}>
                    <div className={classes.name}>{message.authorName}</div>
                    <div className={classes.date}>{message.dateCreated}</div>
                </div>
                <div className={classes.description}>{message.content}</div>
            </div>
        )
    }

    const renderMessagesList = () => {
        if (!feed.messages || !feed.messages.length) {
            return (
                <Empty message='Нет сообщений'/>
            )
        }

        return (
            <div className={classes.blockMessages}>
                <BlockingElement fetching={fetching} className={classes.messageList}>
                    {feed.messages.map((message: IFeedMessage) => renderMessage(message))}
                </BlockingElement>
                <div className={classes.field}>
                    <TextAreaBox value={message.content}
                                 onChange={(value: string) => setMessage({
                                     ...message,
                                     content: value
                                 })}
                                 placeHolder='Введите текст сообщения'
                                 icon='paragraph'
                    />
                </div>
                <Button type='apply'
                        icon='check'
                        onClick={() => saveMessage()}
                        disabled={fetching || message.content.trim() === ''}
                >Отправить</Button>
            </div>
        )
    }

    const renderFeedInformation = () => {
        return (
            <>
                <h2>{feed.title}</h2>

                {['director', 'administrator', 'manager'].includes(role) ?
                    <div className={classes.information}>
                        <div className={classes.col}>
                            {feed.author ?
                                <div className={classes.row}>
                                    <span>Автор</span>
                                    <span>{feed.author}</span>
                                </div>
                                : null
                            }

                            {feed.phone ?
                                <div className={classes.row}>
                                    <span>Телефон</span>
                                    <span>{feed.phone}</span>
                                </div>
                                : null
                            }

                            {feed.name ?
                                <div className={classes.row}>
                                    <span>Имя</span>
                                    <span>{feed.name}</span>
                                </div>
                                : null
                            }

                            {feed.objectId && objectType ?
                                <div className={classes.row}>
                                    <span>{objectType.text}</span>
                                    <span>{info.objectName}</span>
                                </div>
                                : null
                            }
                        </div>

                        <div className={classes.col}>
                            {feedType ?
                                <div className={classes.row}>
                                    <span>Тип</span>
                                    <span>{feedType.text}</span>
                                </div>
                                : null
                            }

                            <div className={classes.row}>
                                <span>Создано</span>
                                <span>{feed.dateCreated}</span>
                            </div>

                            <div className={classes.row}>
                                <span>Обновлено</span>
                                <span>{feed.dateUpdate}</span>
                            </div>

                            <div className={classes.row}>
                                <StatusBox value={feed.status} items={items} onChange={saveHandler.bind(this)}/>
                            </div>
                        </div>
                    </div>
                    : null
                }

                {feed.type === 'feed' ? renderMessagesList() : null}
            </>
        )
    }

    return (
        <Popup className={classes.PopupSupportInfo}>
            <Header title={`Тикет #${feed.id}`}
                    popupId={props.id ? props.id : ''}
            />

            <Content className={classes['popup-content']}>
                <BlockingElement fetching={fetching} className={classes.content}>
                    {!feed.id ? <Empty message='Заявка не найдена'/> : renderFeedInformation()}
                </BlockingElement>
            </Content>

            <Footer>
                <Button type='regular'
                        icon='xmark'
                        onClick={close.bind(this)}
                >Закрыть</Button>
            </Footer>
        </Popup>
    )
}

PopupSupportInfo.defaultProps = defaultProps
PopupSupportInfo.displayName = 'PopupSupportInfo'

export default function openPopupSupportInfo(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupSupportInfo), popupProps, undefined, block, displayOptions)
}