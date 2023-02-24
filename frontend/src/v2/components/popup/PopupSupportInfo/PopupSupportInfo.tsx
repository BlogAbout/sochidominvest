import React, {useEffect, useMemo, useState} from 'react'
import withStore from '../../../../hoc/withStore'
import {PopupDisplayOptions, PopupProps} from '../../../../@types/IPopup'
import {IFeed, IFeedMessage} from '../../../../@types/IFeed'
import {ISelector} from '../../../../@types/ISelector'
import {ITab} from '../../../../@types/ITab'
import {feedStatuses, getFeedObjectText, getFeedTypesText} from '../../../../helpers/supportHelper'
import {allowForRole} from '../../../helpers/accessHelper'
import FeedService from '../../../../api/FeedService'
import BuildingService from '../../../../api/BuildingService'
import {getPopupContainer, openPopup, removePopup} from '../../../../helpers/popupHelper'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../../../../components/PopupAlert/PopupAlert'
import {Footer, Popup} from '../../../../components/popup/Popup/Popup'
import BlockingElement from '../../../../components/ui/BlockingElement/BlockingElement'
import Button from '../../form/Button/Button'
import Empty from '../../ui/Empty/Empty'
import TextAreaBox from '../../../../components/form/TextAreaBox/TextAreaBox'
import StatusBox from '../../../../components/StatusBox/StatusBox'
import Title from '../../ui/Title/Title'
import TextBox from '../../form/TextBox/TextBox'
import Field from '../../form/Field/Field'
import Tabs from '../../../../components/ui/Tabs/Tabs'
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
    const closePopup = () => {
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

        if (allowForRole(['director', 'administrator', 'manager'])) {
            updateFeed.status = 'close'
        } else {
            updateFeed.status = 'new'
        }

        setFetching(true)

        FeedService.saveFeed(updateFeed)
            .then((response: any) => {
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
            })
            .finally(() => setFetching(false))
    }

    const items = useMemo(() => {
        return feedStatuses.map((item: ISelector) => {
            return {
                title: item.text,
                text: item.key,
                onClick: () => {
                    saveHandler(item.key)
                }
            }
        })
    }, [])

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

    const renderInfoTab = () => {
        return (
            <div key='info' className={classes.tabContent}>
                <Title type='h2'>{`Тикет #${feed.id}`}</Title>

                <Field label='Тема'
                       title='Тема'
                       type='hor'
                       style='dark'
                       labelWidth={150}
                >
                    <TextBox value={feed.title}
                             onChange={() => {
                             }}
                             styleType='minimal'
                             readOnly
                             width='100%'
                    />
                </Field>

                {allowForRole(['director', 'administrator', 'manager']) ?
                    <>
                        {feed.author ?
                            <Field label='Автор'
                                   title='Автор'
                                   type='hor'
                                   style='dark'
                                   labelWidth={150}
                            >
                                <TextBox value={feed.author}
                                         onChange={() => {
                                         }}
                                         styleType='minimal'
                                         readOnly
                                         width='100%'
                                />
                            </Field>
                            : null
                        }

                        {feed.phone ?
                            <Field label='Телефон'
                                   title='Телефон'
                                   type='hor'
                                   style='dark'
                                   labelWidth={150}
                            >
                                <TextBox value={feed.phone}
                                         onChange={() => {
                                         }}
                                         styleType='minimal'
                                         readOnly
                                         width='100%'
                                />
                            </Field>
                            : null
                        }

                        {feed.name ?
                            <Field label='Имя'
                                   title='Имя'
                                   type='hor'
                                   style='dark'
                                   labelWidth={150}
                            >
                                <TextBox value={feed.name}
                                         onChange={() => {
                                         }}
                                         styleType='minimal'
                                         readOnly
                                         width='100%'
                                />
                            </Field>
                            : null
                        }

                        {feed.objectId && feed.objectType ?
                            <Field label={getFeedObjectText(feed.objectType)}
                                   title={getFeedObjectText(feed.objectType)}
                                   type='hor'
                                   style='dark'
                                   labelWidth={150}
                            >
                                <TextBox value={info.objectName}
                                         onChange={() => {
                                         }}
                                         styleType='minimal'
                                         readOnly
                                         width='100%'
                                />
                            </Field>
                            : null
                        }

                        {feed.type ?
                            <Field label='Тип'
                                   title='Тип'
                                   type='hor'
                                   style='dark'
                                   labelWidth={150}
                            >
                                <TextBox value={getFeedTypesText(feed.type)}
                                         onChange={() => {
                                         }}
                                         styleType='minimal'
                                         readOnly
                                         width='100%'
                                />
                            </Field>
                            : null
                        }

                        <Field label='Создано'
                               title='Создано'
                               type='hor'
                               style='dark'
                               labelWidth={150}
                        >
                            <TextBox value={feed.dateCreated}
                                     onChange={() => {
                                     }}
                                     styleType='minimal'
                                     readOnly
                                     width='100%'
                            />
                        </Field>

                        <Field label='Обновлено'
                               title='Обновлено'
                               type='hor'
                               style='dark'
                               labelWidth={150}
                        >
                            <TextBox value={feed.dateUpdate}
                                     onChange={() => {
                                     }}
                                     styleType='minimal'
                                     readOnly
                                     width='100%'
                            />
                        </Field>

                        <Field label='Статус'
                               title='Статус'
                               type='hor'
                               style='dark'
                               labelWidth={150}
                        >
                            <StatusBox value={feed.status}
                                       items={items}
                                       onChange={saveHandler.bind(this)}
                            />
                        </Field>
                    </>
                    : null
                }
            </div>
        )
    }

    const renderMessagesTab = () => {
        if (!feed.messages || !feed.messages.length) {
            return (
                <Empty message='Нет сообщений'/>
            )
        }

        return (
            <div key='messages' className={classes.tabContent}>
                <Title type='h2'>Сообщения</Title>

                <BlockingElement fetching={false} className={classes.messageList}>
                    {feed.messages.map((message: IFeedMessage) => renderMessage(message))}
                </BlockingElement>

                <Field label='Сообщение'
                       title='Тема'
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
                    />
                </Field>

                <Button type='apply'
                        icon='check'
                        onClick={() => saveMessage()}
                        disabled={fetching || message.content.trim() === ''}
                >Отправить</Button>
            </div>
        )
    }

    const tabs: ITab = useMemo(() => {
        const tabsList: ITab = {
            info: {title: 'Информация', render: renderInfoTab()}
        }

        if (feed.type === 'feed') {
            tabsList.messages = {title: 'Сообщения', render: renderMessagesTab()}
        }

        return tabsList
    }, [feed, message, info])

    return (
        <Popup className={classes.PopupSupportInfo}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    {!feed.id
                        ? <Empty message='Заявка не найдена'/>
                        : <Tabs tabs={tabs} paddingFirstTab='popup'/>
                    }
                </div>
            </BlockingElement>

            <Footer>
                <Button type='regular'
                        icon='xmark'
                        onClick={closePopup.bind(this)}
                >Закрыть</Button>
            </Footer>
        </Popup>
    )
}

PopupSupportInfo.defaultProps = defaultProps
PopupSupportInfo.displayName = 'PopupSupportInfo'

export default function openPopupSupportInfo(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupSupportInfo), popupProps, undefined, block, displayOptions)
}