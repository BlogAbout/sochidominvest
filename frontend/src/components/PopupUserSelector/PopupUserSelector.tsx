import React, {useEffect, useState} from 'react'
import withStore from '../../hoc/withStore'
import {PopupProps} from '../../@types/IPopup'
import {IUser} from '../../@types/IUser'
import UserService from '../../api/UserService'
import {getPopupContainer, openPopup, removePopup} from '../../helpers/popupHelper'
import {Content, Footer, Header, Popup} from '../Popup/Popup'
import BlockingElement from '../BlockingElement/BlockingElement'
import Empty from '../Empty/Empty'
import openContextMenu from '../ContextMenu/ContextMenu'
import openPopupUserCreate from '../PopupUserCreate/PopupUserCreate'
import showBackgroundBlock from '../BackgroundBlock/BackgroundBlock'
import ButtonAdd from '../ButtonAdd/ButtonAdd'
import SearchBox from '../SearchBox/SearchBox'
import CheckBox from '../CheckBox/CheckBox'
import Button from '../Button/Button'
import openPopupAlert from '../PopupAlert/PopupAlert'
import {useTypedSelector} from '../../hooks/useTypedSelector'
import {useActions} from '../../hooks/useActions'
import classes from './PopupUserSelector.module.scss'

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
        console.info('PopupUserSelector onAdd')
    },
    onSelect: (value: number[]) => {
        console.info('PopupUserSelector onSelect', value)
    }
}

const PopupUserSelector: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterUsers, setFilterUsers] = useState<IUser[]>([])
    const [selectedUsers, setSelectedUsers] = useState<number[]>(props.selected || [])
    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)
    const {fetching: fetchingUserList, users} = useTypedSelector(state => state.userReducer)
    const {fetchUserList} = useActions()

    useEffect(() => {
        if (!users.length || isUpdate) {
            fetchUserList({active: [0, 1]})

            setIsUpdate(false)
        }

        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [users])

    useEffect(() => {
        setFetching(fetchingUserList)
    }, [fetchingUserList])

    // Закрытие Popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Клик на строку
    const selectRow = (user: IUser) => {
        if (props.multi) {
            selectRowMulti(user)
        } else if (props.onSelect !== null) {
            props.onSelect(user.id ? [user.id] : [0])
            close()
        }
    }

    // Клик на строку в мульти режиме
    const selectRowMulti = (user: IUser) => {
        if (user.id) {
            if (checkSelected(user.id)) {
                setSelectedUsers(selectedUsers.filter((key: number) => key !== user.id))
            } else {
                setSelectedUsers([...selectedUsers, user.id])
            }
        }
    }

    // Проверка наличия элемента среди выбранных
    const checkSelected = (id: number | null) => {
        return id !== null && selectedUsers.includes(id)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (value.trim() !== '') {
            setFilterUsers(users.filter((user: IUser) => {
                return user.firstName.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterUsers(users)
        }
    }

    // Добавление нового элемента
    const onClickAdd = (e: React.MouseEvent) => {
        openPopupUserCreate(e.currentTarget, {
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Редактирование элемента
    const onClickEdit = (e: React.MouseEvent, user: IUser) => {
        openPopupUserCreate(e.currentTarget, {
            user: user,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Сохранение выбора
    const onClickSave = () => {
        props.onSelect(selectedUsers)
        close()
    }

    // Удаление элемента справочника
    const onClickDelete = (e: React.MouseEvent, user: IUser) => {
        openPopupAlert(e, {
            text: `Вы действительно хотите удалить ${user.firstName}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        setFetching(true)

                        if (user.id) {
                            UserService.removeUser(user.id)
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
    const onContextMenu = (e: React.MouseEvent, user: IUser) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{text: 'Редактировать', onClick: (e: React.MouseEvent) => onClickEdit(e, user)}]

            if (['director', 'administrator'].includes(role)) {
                menuItems.push({text: 'Удалить', onClick: (e: React.MouseEvent) => onClickDelete(e, user)})
            }

            openContextMenu(e, menuItems)
        }
    }

    const renderLeftBox = () => {
        return (
            <div className={classes['box']}>
                <div style={{height: 38}}>
                    {renderSearch()}
                </div>
                <div className={classes['box_border']} style={{height: 300}}>
                    {!props.multi ? renderLeftTab() :
                        <div className={classes['box_content_wrapper']}>
                            {renderLeftTab()}
                        </div>
                    }
                </div>
            </div>
        )
    }

    const renderSearch = () => {
        return (
            <div className={classes['search_and_button']}>
                <SearchBox value={searchText}
                           onChange={(value: string) => search(value)}
                           countFind={filterUsers ? filterUsers.length : 0}
                           showClear
                           flexGrow
                           autoFocus
                />

                {props.buttonAdd && ['director', 'administrator', 'manager'].includes(role) ?
                    <ButtonAdd onClick={onClickAdd.bind(this)}/>
                    : null}
            </div>
        )
    }

    const renderLeftTab = () => {
        return (
            <div className={classes['box_content']}>
                {filterUsers.length ?
                    filterUsers.map((user: IUser) => renderRow(user, 'left', checkSelected(user.id)))
                    :
                    <Empty message={!users.length ? 'Нет застройщиков' : 'Застройщики не найдены'}/>
                }
            </div>
        )
    }

    const renderRightBox = () => {
        return (
            <div className={classes['box']}>
                <div style={{height: 38, flex: 'none'}}/>
                <div className={classes['box_border']} style={{height: 400}}>
                    {renderRightTab()}
                </div>
            </div>
        )
    }

    const renderRightTab = () => {
        const rows = filterUsers.filter((user: IUser) => checkSelected(user.id))

        return (
            <div className={classes['box_content']}>
                {rows.length ? rows.map((user: IUser) => renderRow(user, 'right', checkSelected(user.id))) : ''}
            </div>
        )
    }

    const renderRow = (user: IUser, side: string, checked: boolean) => {
        return (
            <div className={classes['row']}
                 key={user.id}
                 onClick={() => selectRow(user)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, user)}
            >
                {props.multi && side === 'left' ?
                    <CheckBox type={'classic'} onChange={e => e}
                              checked={checked}
                              margin={'0px 0px 0px 10px'}
                              label={''}
                    />
                    : null
                }

                <div className={classes['item_name']}>{user.firstName}</div>

                {!checked || props.multi ? null : <div className={classes['selected_icon']}/>}

                {props.multi && side === 'right' ? <div className={classes['delete_icon']} title='Удалить'/> : null}
            </div>
        )
    }

    return (
        <Popup className={classes.popup}>
            <Header title='Выбрать контакт' popupId={props.id ? props.id : ''} onClose={() => close()}/>

            <BlockingElement fetching={fetching}>
                <Content className={props.multi ? classes['content_multi'] : classes['content']}>
                    {renderLeftBox()}

                    {!props.multi ? null : renderRightBox()}
                </Content>

                {props.multi ?
                    <Footer>
                        <Button type='apply'
                                icon='check'
                                onClick={() => onClickSave()}
                                className='marginLeft'
                        >Сохранить</Button>

                        <Button type='regular'
                                icon='arrow-rotate-left'
                                onClick={close.bind(this)}
                                className='marginLeft'
                        >Отменить</Button>
                    </Footer>
                    :
                    <div className={classes['footer_spacer']}/>
                }
            </BlockingElement>
        </Popup>
    )
}

PopupUserSelector.defaultProps = defaultProps
PopupUserSelector.displayName = 'PopupUserSelector'

export default function openPopupUserSelector(target: any, popupProps = {} as Props) {
    const displayOptions = {
        autoClose: false,
        center: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupUserSelector), popupProps, undefined, block, displayOptions)
}