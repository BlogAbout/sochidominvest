import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import withStore from '../../../hoc/withStore'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IFeed} from '../../../@types/IFeed'
import FeedService from '../../../api/FeedService'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Empty from '../../Empty/Empty'
import openContextMenu from '../../ContextMenu/ContextMenu'
import openPopupSupportCreate from '../PopupSupportCreate/PopupSupportCreate'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import ButtonAdd from '../../ButtonAdd/ButtonAdd'
import SearchBox from '../../SearchBox/SearchBox'
import CheckBox from '../../form/CheckBox/CheckBox'
import Button from '../../form/Button/Button'
import Title from '../../ui/Title/Title'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import classes from './PopupFeedSelector.module.scss'

interface Props extends PopupProps {
    selected?: number[]
    buttonAdd?: boolean
    multi?: boolean

    onSelect(value: number[]): void

    onAdd?(): void
}

const defaultProps: Props = {
    selected: [],
    buttonAdd: true,
    multi: false,
    onAdd: () => {
        console.info('PopupFeedSelector onAdd')
    },
    onSelect: (value: number[]) => {
        console.info('PopupFeedSelector onSelect', value)
    }
}

const PopupFeedSelector: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(true)
    const [searchText, setSearchText] = useState('')
    const [feeds, setFeeds] = useState<IFeed[]>([])
    const [filterFeeds, setFilterFeeds] = useState<IFeed[]>([])
    const [selectedFeeds, setSelectedFeeds] = useState<number[]>(props.selected || [])
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [])

    useEffect(() => {
        if (isUpdate) {
            setFetching(true)

            FeedService.fetchFeeds({active: [0, 1]})
                .then((response: any) => {
                    setFeeds(response.data)
                })
                .catch((error: any) => {
                    openPopupAlert(document.body, {
                        title: 'Ошибка!',
                        text: error.data,
                        onOk: close.bind(this)
                    })
                })
                .finally(() => {
                    setFetching(false)
                })
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [feeds])

    // Закрытие Popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Клик на строку
    const selectRow = (feed: IFeed) => {
        if (props.multi) {
            selectRowMulti(feed)
        } else if (props.onSelect !== null) {
            props.onSelect(feed.id ? [feed.id] : [0])
            close()
        }
    }

    // Клик на строку в мульти режиме
    const selectRowMulti = (feed: IFeed) => {
        if (feed.id) {
            if (checkSelected(feed.id)) {
                setSelectedFeeds(selectedFeeds.filter((key: number) => key !== feed.id))
            } else {
                setSelectedFeeds([...selectedFeeds, feed.id])
            }
        }
    }

    // Проверка наличия элемента среди выбранных
    const checkSelected = (id: number | null) => {
        return id !== null && selectedFeeds.includes(id)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (value.trim() !== '') {
            setFilterFeeds(feeds.filter((feed: IFeed) => {
                return feed.title.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterFeeds(feeds)
        }
    }

    // Добавление нового элемента
    const onClickAdd = () => {
        openPopupSupportCreate(document.body, {
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Сохранение выбора
    const onClickSave = () => {
        props.onSelect(selectedFeeds)
        close()
    }

    // Удаление элемента справочника
    const onClickDelete = (e: React.MouseEvent, feed: IFeed) => {
        openPopupAlert(e, {
            text: `Вы действительно хотите удалить ${feed.title}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        setFetching(true)

                        if (feed.id) {
                            FeedService.removeFeed(feed.id)
                                .then(() => {
                                    setFetching(false)
                                    setIsUpdate(true)
                                })
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data,
                                        onOk: close.bind(this)
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

    // Открытие контекстного меню на элементе справочника
    const onContextMenu = (e: React.MouseEvent, feed: IFeed) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = []

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: (e: React.MouseEvent) => onClickDelete(e, feed)})
            }

            openContextMenu(e, menuItems)
        }
    }

    const renderSearch = () => {
        return (
            <div className={classes.search}>
                <SearchBox value={searchText}
                           onChange={(value: string) => search(value)}
                           countFind={filterFeeds ? filterFeeds.length : 0}
                           showClear
                           flexGrow
                           autoFocus
                />

                {props.buttonAdd && ['director', 'administrator', 'manager'].includes(role) ?
                    <ButtonAdd onClick={onClickAdd.bind(this)}/>
                    : null
                }
            </div>
        )
    }

    const renderListBox = () => {
        return (
            <BlockingElement fetching={false} className={classes.list}>
                <div className={classes.listContent}>
                    {filterFeeds.length ?
                        filterFeeds.map((feed: IFeed) => renderRow(feed, 'left', checkSelected(feed.id)))
                        : <Empty message={!feeds.length ? 'Нет тикетов' : 'Тикеты не найдены'}/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderSelectedListBox = () => {
        const rows = filterFeeds.filter((feed: IFeed) => checkSelected(feed.id))

        return (
            <BlockingElement fetching={false} className={classes.list}>
                <div className={classes.listContent}>
                    {rows.length ?
                        rows.map((feed: IFeed) => renderRow(feed, 'right', checkSelected(feed.id)))
                        : <Empty message='Тикеты не выбраны'/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderRow = (feed: IFeed, side: string, checked: boolean) => {
        return (
            <div className={classes.row}
                 key={feed.id}
                 onClick={() => selectRow(feed)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, feed)}
            >
                {props.multi && side === 'left' ?
                    <CheckBox type='classic'
                              onChange={e => e}
                              checked={checked}
                              margin='0px 0px 0px 10px'
                              label=''
                    />
                    : null
                }

                {!checked || props.multi ? null :
                    <div className={classes.selected}>
                        <FontAwesomeIcon icon='check'/>
                    </div>
                }

                <div className={classes.name}>{feed.title}</div>

                {props.multi && side === 'right' ?
                    <div className={classes.delete} title='Удалить'>
                        <FontAwesomeIcon icon='xmark'/>
                    </div>
                    : null
                }
            </div>
        )
    }

    return (
        <Popup className={classes.PopupFeedSelector}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>Выбрать тикет</Title>

                    {renderSearch()}

                    {renderListBox()}

                    {props.multi ? renderSelectedListBox() : null}
                </div>
            </BlockingElement>

            {props.multi ?
                <Footer>
                    <Button type='apply'
                            icon='check'
                            onClick={() => onClickSave()}
                            className='marginLeft'
                            title='Сохранить'
                    >Сохранить</Button>

                    <Button type='regular'
                            icon='arrow-rotate-left'
                            onClick={close.bind(this)}
                            className='marginLeft'
                            title='Отменить'
                    >Отменить</Button>
                </Footer>
                :
                null
            }
        </Popup>
    )
}

PopupFeedSelector.defaultProps = defaultProps
PopupFeedSelector.displayName = 'PopupFeedSelector'

export default function openPopupFeedSelector(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupFeedSelector), popupProps, undefined, block, displayOptions)
}