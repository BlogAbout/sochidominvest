import React, {useEffect, useState} from 'react'
import {PopupProps} from '../../@types/IPopup'
import {IFeed} from '../../@types/IFeed'
import {ISelector} from '../../@types/ISelector'
import {feedStatuses, feedTypes, objectTypes} from '../../helpers/supportHelper'
import FeedService from '../../api/FeedService'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import showBackgroundBlock from '../BackgroundBlock/BackgroundBlock'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import StatusBox from '../StatusBox/StatusBox'
import Button from '../Button/Button'
import classes from './PopupSupportInfo.module.scss'
import BuildingService from "../../api/BuildingService";

interface Props extends PopupProps {
    feed?: IFeed | null

    onSave(): void
}

const defaultProps: Props = {
    feed: null,
    onSave: () => {
        console.info('PopupSupportInfo onSave')
    }
}

const PopupSupportInfo: React.FC<Props> = (props) => {
    const [feed, setFeed] = useState<IFeed>(props.feed || {
        id: null,
        userId: null,
        author: null,
        phone: null,
        name: null,
        title: '',
        type: 'feed',
        objectId: null,
        objectType: null,
        active: 1,
        status: 'new'
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

    return (
        <Popup className={classes.PopupSupportInfo}>
            <Header title={`Тикет #${feed.id}`}
                    popupId={props.id ? props.id : ''}
            />

            <Content className={classes['popup-content']}>
                <BlockingElement fetching={fetching} className={classes.content}>
                    <h2>{feed.title}</h2>

                    <div className={classes.col}>
                        {feed.userId ?
                            <div className={classes.row}>
                                <span>Ответственный</span>
                                <span>{feed.userId}</span>
                            </div>
                            : null
                        }

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

                    <div className={classes.log}>
                        Здесь будет лог событий/чат (в разработке)
                    </div>
                </BlockingElement>
            </Content>

            <Footer>
                <Button type="regular"
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

    return openPopup(PopupSupportInfo, popupProps, undefined, block, displayOptions)
}