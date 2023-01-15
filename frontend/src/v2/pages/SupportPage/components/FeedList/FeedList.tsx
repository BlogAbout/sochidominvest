import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {RouteNames} from '../../../../helpers/routerHelper'
import {IBusinessProcess} from '../../../../../@types/IBusinessProcess'
import {IFeed} from '../../../../../@types/IFeed'
import {getFeedStatusesText, getFeedTypesText} from '../../../../../helpers/supportHelper'
import {allowForRole} from '../../../../helpers/accessHelper'
import FeedService from '../../../../../api/FeedService'
import ListHead from '../../../../components/ui/List/components/ListHead/ListHead'
import ListCell from '../../../../components/ui/List/components/ListCell/ListCell'
import ListBody from '../../../../components/ui/List/components/ListBody/ListBody'
import ListRow from '../../../../components/ui/List/components/ListRow/ListRow'
import List from '../../../../components/ui/List/List'
import Empty from '../../../../components/ui/Empty/Empty'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import openPopupBusinessProcessCreate
    from '../../../../../components/popup/PopupBusinessProcessCreate/PopupBusinessProcessCreate'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import openPopupSupportInfo from '../../../../components/popup/PopupSupportInfo/PopupSupportInfo'
import classes from './FeedList.module.scss'

interface Props {
    list: IFeed[]
    fetching: boolean
    isCompact?: boolean

    onSave(): void
}

const defaultProps: Props = {
    list: [],
    fetching: false,
    onSave: () => {
        console.info('BuildingList onSave')
    }
}

const FeedList: React.FC<Props> = (props): React.ReactElement => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(props.fetching)

    const {user} = useTypedSelector(state => state.userReducer)

    // Удаление заявки
    const removeHandler = (feed: IFeed) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить "${feed.title}"?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (feed.id) {
                            setFetching(true)

                            FeedService.removeFeed(feed.id)
                                .then(() => {
                                    setFetching(false)
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
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Отправка заявки в обработку
    const processHandler = (feed: IFeed) => {
        if (!feed.id) {
            return
        }

        const businessProcess: IBusinessProcess = {
            id: null,
            ticketId: feed.id,
            author: user.id,
            responsible: user.id,
            active: 1,
            type: 'feed',
            step: 'default',
            name: feed.title,
            description: '',
            relations: [
                {objectId: feed.id, objectType: 'feed'}
            ]
        }

        openPopupBusinessProcessCreate(document.body, {
            businessProcess: businessProcess,
            onSave: () => {
                navigate(RouteNames.P_BP)
            }
        })
    }

    // Закрытие заявки
    const closeHandler = (feed: IFeed) => {
        const updateFeed = {...feed}

        updateFeed.status = 'close'

        setFetching(true)

        FeedService.saveFeed(updateFeed)
            .then(() => {
                props.onSave()
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })

                setFetching(false)
            })
            .finally(() => {
                setFetching(false)
            })
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (feed: IFeed, e: React.MouseEvent) => {
        e.preventDefault()

        if (allowForRole(['director', 'administrator', 'manager'])) {
            const menuItems = [
                {text: 'Взять в обработку', onClick: () => processHandler(feed)},
                {text: 'Закрыть заявку', onClick: () => closeHandler(feed)}
            ]

            if (allowForRole(['director', 'administrator'])) {
                menuItems.push({text: 'Удалить', onClick: () => removeHandler(feed)})
            }

            openContextMenu(e, menuItems)
        }
    }

    return (
        <List className={classes.FeedList}>
            <ListHead>
                <ListCell className={classes.id}>#</ListCell>
                <ListCell className={classes.title}>Заголовок</ListCell>
                <ListCell className={classes.status}>Статус</ListCell>

                {allowForRole(['director', 'administrator', 'manager']) ?
                    <>
                        <ListCell className={classes.name}>Имя</ListCell>
                        <ListCell className={classes.phone}>Телефон</ListCell>
                        <ListCell className={classes.type}>Тип</ListCell>
                    </>
                    : null
                }
            </ListHead>

            <ListBody fetching={props.fetching || fetching}>
                {props.list && props.list.length ?
                    props.list.map((feed: IFeed) => {
                        return (
                            <ListRow key={feed.id}
                                     onContextMenu={(e: React.MouseEvent) => onContextMenu(feed, e)}
                                     onClick={() => openPopupSupportInfo(document.body, {
                                         feedId: feed.id,
                                         onSave: props.onSave
                                     })}
                                     isCompact={props.isCompact}
                            >
                                <ListCell className={classes.id}>#{feed.id}</ListCell>
                                <ListCell className={classes.title}>{feed.title}</ListCell>
                                <ListCell className={classes.status}>{getFeedStatusesText(feed.status)}</ListCell>

                                {allowForRole(['director', 'administrator', 'manager']) ?
                                    <>
                                        <ListCell className={classes.name}>{feed.name}</ListCell>
                                        <ListCell className={classes.phone}>{feed.phone}</ListCell>
                                        <ListCell className={classes.type}>{getFeedTypesText(feed.type)}</ListCell>
                                    </>
                                    : null
                                }
                            </ListRow>
                        )
                    })
                    : <Empty message='Нет заявок'/>
                }
            </ListBody>
        </List>
    )
}

FeedList.defaultProps = defaultProps
FeedList.displayName = 'AgentList'

export default React.memo(FeedList)