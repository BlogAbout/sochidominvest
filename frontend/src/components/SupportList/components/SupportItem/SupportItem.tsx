import React, {useState} from 'react'
import classNames from 'classnames/bind'
import {useTypedSelector} from '../../../../hooks/useTypedSelector'
import {IFeed} from '../../../../@types/IFeed'
import {ISelector} from '../../../../@types/ISelector'
import {feedStatuses, feedTypes} from '../../../../helpers/supportHelper'
import FeedService from '../../../../api/FeedService'
import openPopupAlert from '../../../PopupAlert/PopupAlert'
import openContextMenu from '../../../ContextMenu/ContextMenu'
import Preloader from '../../../Preloader/Preloader'
import openPopupSupportInfo from '../../../PopupSupportInfo/PopupSupportInfo'
import classes from './SupportItem.module.scss'

interface Props {
    feed: IFeed

    onSave(): void
}

const defaultProps: Props = {
    feed: {} as IFeed,
    onSave: () => {
        console.info('SupportItem onSave')
    }
}

const cx = classNames.bind(classes)

const SupportItem: React.FC<Props> = (props) => {
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)

    // Удаление заявки
    const removeHandler = () => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${props.feed.title}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (props.feed.id) {
                            setFetching(true)

                            FeedService.removeFeed(props.feed.id)
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
    const processHandler = () => {

    }

    // Закрытие заявки
    const closeHandler = () => {
        // const user: IUser = {...props.user}
        // user.block = user.block ? 0 : 1
        //
        // UserService.saveUser(user)
        //     .then(() => {
        //         setFetching(false)
        //
        //         props.onSave()
        //     })
        //     .catch((error: any) => {
        //         openPopupAlert(document.body, {
        //             title: 'Ошибка!',
        //             text: error.data
        //         })
        //
        //         setFetching(false)
        //     })
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [
                {text: 'Взять в обработку', onClick: () => processHandler()},
                {text: 'Закрыть заявку', onClick: () => closeHandler()}
            ]

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: () => removeHandler()})
            }

            openContextMenu(e, menuItems)
        }
    }

    const feedType = feedTypes.find((type: ISelector) => type.key === props.feed.type)
    const feedStatus = feedStatuses.find((status: ISelector) => status.key === props.feed.status)

    return (
        <div className={cx({'SupportItem': true, [`${props.feed.type}`]: true})}
             onClick={(e: React.MouseEvent) => openPopupSupportInfo(e, {
                 feed: props.feed,
                 onSave: props.onSave
             })}
             onContextMenu={(e: React.MouseEvent) => onContextMenu(e)}
        >
            {fetching && <Preloader/>}

            <div className={classes.id}>#{props.feed.id}</div>
            <div className={classes.title}>{props.feed.title}</div>
            <div className={classes.status}>{feedStatus ? feedStatus.text : ''}</div>
            <div className={classes.name}>{props.feed.name}</div>
            <div className={classes.phone}>{props.feed.phone}</div>
            <div className={classes.type}>{feedType ? feedType.text : ''}</div>
        </div>
    )
}

SupportItem.defaultProps = defaultProps
SupportItem.displayName = 'SupportItem'

export default SupportItem