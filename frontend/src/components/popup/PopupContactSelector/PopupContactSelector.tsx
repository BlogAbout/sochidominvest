import React, {useEffect, useState} from 'react'
import withStore from '../../../hoc/withStore'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {PopupDisplayOptions, PopupProps} from '../../../@types/IPopup'
import {IContact} from '../../../@types/IAgent'
import AgentService from '../../../api/AgentService'
import {getPopupContainer, openPopup, removePopup} from '../../../helpers/popupHelper'
import {Footer, Popup} from '../Popup/Popup'
import BlockingElement from '../../ui/BlockingElement/BlockingElement'
import Empty from '../../Empty/Empty'
import openContextMenu from '../../ContextMenu/ContextMenu'
import openPopupContactCreate from '../PopupContactCreate/PopupContactCreate'
import showBackgroundBlock from '../../ui/BackgroundBlock/BackgroundBlock'
import SearchBox from '../../SearchBox/SearchBox'
import CheckBox from '../../form/CheckBox/CheckBox'
import Button from '../../form/Button/Button'
import Title from '../../ui/Title/Title'
import openPopupAlert from '../../PopupAlert/PopupAlert'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import classes from './PopupContactSelector.module.scss'

interface Props extends PopupProps {
    selected?: number[]
    multi?: boolean

    onSelect(value: number[]): void

    onAdd?(): void
}

const defaultProps: Props = {
    selected: [],
    multi: false,
    onAdd: () => {
        console.info('PopupContactSelector onAdd')
    },
    onSelect: (value: number[]) => {
        console.info('PopupContactSelector onSelect', value)
    }
}

const PopupContactSelector: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [contacts, setContacts] = useState<IContact[]>([])
    const [filterContacts, setFilterContacts] = useState<IContact[]>([])
    const [selectedContacts, setSelectedContacts] = useState<number[]>(props.selected || [])
    const [fetching, setFetching] = useState(false)

    const {role, userId} = useTypedSelector(state => state.userReducer)

    useEffect(() => {
        if (!contacts.length || isUpdate) {
            fetchContactsForAgentHandler()

            setIsUpdate(false)
        }

        return () => {
            removePopup(props.blockId ? props.blockId : '')
        }
    }, [isUpdate, userId])

    useEffect(() => {
        search(searchText)
    }, [contacts])

    // Загрузка контактов всех агентств пользователя
    const fetchContactsForAgentHandler = () => {
        setFetching(true)

        AgentService.fetchContacts({author: [userId], active: [0, 1]})
            .then((response: any) => {
                setContacts(response.data)
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })
            })
            .finally(() => setFetching(false))
    }

    // Закрытие Popup
    const close = () => {
        removePopup(props.id ? props.id : '')
    }

    // Клик на строку
    const selectRow = (contact: IContact) => {
        if (props.multi) {
            selectRowMulti(contact)
        } else if (props.onSelect !== null) {
            props.onSelect(contact.id ? [contact.id] : [0])
            close()
        }
    }

    // Клик на строку в мульти режиме
    const selectRowMulti = (contact: IContact) => {
        if (contact.id) {
            if (checkSelected(contact.id)) {
                setSelectedContacts(selectedContacts.filter((key: number) => key !== contact.id))
            } else {
                setSelectedContacts([...selectedContacts, contact.id])
            }
        }
    }

    // Проверка наличия элемента среди выбранных
    const checkSelected = (id: number | null) => {
        return id !== null && selectedContacts.includes(id)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (value.trim() !== '') {
            setFilterContacts(contacts.filter((contact: IContact) => {
                return contact.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterContacts(contacts)
        }
    }

    // Редактирование элемента
    const onClickEdit = (e: React.MouseEvent, contact: IContact) => {
        openPopupContactCreate(document.body, {
            contact: contact,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Сохранение выбора
    const onClickSave = () => {
        props.onSelect(selectedContacts)
        close()
    }

    // Удаление элемента справочника
    const onClickDelete = (e: React.MouseEvent, contact: IContact) => {
        openPopupAlert(e, {
            text: `Вы действительно хотите удалить ${contact.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        setFetching(true)

                        if (contact.id) {
                            AgentService.removeContact(contact.id)
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
    const onContextMenu = (e: React.MouseEvent, contact: IContact) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Редактировать', onClick: (e: React.MouseEvent) => onClickEdit(e, contact)},
            {text: 'Удалить', onClick: (e: React.MouseEvent) => onClickDelete(e, contact)}
        ]

        openContextMenu(e, menuItems)
    }

    const renderSearch = () => {
        return (
            <div className={classes.search}>
                <SearchBox value={searchText}
                           onChange={(value: string) => search(value)}
                           countFind={filterContacts ? filterContacts.length : 0}
                           showClear
                           flexGrow
                           autoFocus
                />
            </div>
        )
    }

    const renderListBox = () => {
        return (
            <BlockingElement fetching={false} className={classes.list}>
                <div className={classes.listContent}>
                    {filterContacts.length ?
                        filterContacts.map((contact: IContact) => renderRow(contact, 'left', checkSelected(contact.id)))
                        : <Empty message={!contacts.length ?
                            'Нет контактов. Создать новые контакты Вы можете отдельно для каждого агентства'
                            : 'Контакты не найдены'}
                        />
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderSelectedListBox = () => {
        const rows = filterContacts.filter((contact: IContact) => checkSelected(contact.id))

        return (
            <BlockingElement fetching={false} className={classes.list}>
                <div className={classes.listContent}>
                    {rows.length ?
                        rows.map((contact: IContact) => renderRow(contact, 'right', checkSelected(contact.id)))
                        : <Empty message='Контакты не выбраны'/>
                    }
                </div>
            </BlockingElement>
        )
    }

    const renderRow = (contact: IContact, side: string, checked: boolean) => {
        return (
            <div className={classes.row}
                 key={contact.id}
                 onClick={() => selectRow(contact)}
                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, contact)}
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

                <div className={classes.name}>{contact.name}</div>

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
        <Popup className={classes.PopupContactSelector}>
            <BlockingElement fetching={fetching} className={classes.content}>
                <div className={classes.blockContent}>
                    <Title type={2}>Выбрать контакты</Title>

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

PopupContactSelector.defaultProps = defaultProps
PopupContactSelector.displayName = 'PopupContactSelector'

export default function openPopupContactSelector(target: any, popupProps = {} as Props) {
    const displayOptions: PopupDisplayOptions = {
        autoClose: false,
        rightPanel: true,
        fullScreen: true,
        isFixed: true
    }
    const blockId = showBackgroundBlock(target, {animate: true}, displayOptions)
    let block = getPopupContainer(blockId)

    popupProps = {...popupProps, blockId: blockId}

    return openPopup(withStore(PopupContactSelector), popupProps, undefined, block, displayOptions)
}