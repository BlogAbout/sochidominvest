import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import AgentService from '../../../../../api/AgentService'
import {IUser} from '../../../../../@types/IUser'
import {IContact} from '../../../../../@types/IAgent'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../hooks/useActions'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import Empty from '../../../../Empty/Empty'
import openPopupAlert from '../../../../PopupAlert/PopupAlert'
import openContextMenu from '../../../../ContextMenu/ContextMenu'
import openPopupUserSelector from '../../../../PopupUserSelector/PopupUserSelector'
import openPopupContactSelector from '../../../PopupContactSelector/PopupContactSelector'
import classes from './UserList.module.scss'

interface Props {
    selectedUsers: number[]
    selectedContacts: number[]

    onSelectUsers(value: number[]): void

    onSelectContacts(value: number[]): void
}

const defaultProps: Props = {
    selectedUsers: [],
    selectedContacts: [],
    onSelectUsers: (value: number[]) => {
        console.info('UserList onSelectUsers', value)
    },
    onSelectContacts: (value: number[]) => {
        console.info('UserList onSelectContacts', value)
    }
}

const UserList: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(true)
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([])
    const [selectedContacts, setSelectedContacts] = useState<IContact[]>([])
    const [fetchingContactList, setFetchingContactList] = useState(false)

    const {fetching: fetchingUserList, users} = useTypedSelector(state => state.userReducer)
    const {fetchUserList} = useActions()

    useEffect(() => {
        if (!users.length || isUpdate) {
            fetchUserList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        setSelectedUsers(users.filter((user: IUser) => user.id && props.selectedUsers.includes(user.id)))
    }, [users, props.selectedUsers])

    useEffect(() => {
        fetchContactListHandler()
    }, [props.selectedContacts])

    const fetchContactListHandler = () => {
        if (!props.selectedContacts.length) {
            return
        }

        setFetchingContactList(true)

        AgentService.fetchContacts({id: props.selectedContacts, active: [0, 1]})
            .then((response: any) => {
                setSelectedContacts(response.data)
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })
            })
            .finally(() => setFetchingContactList(false))
    }

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    const onContextMenuUser = (e: React.MouseEvent, user: IUser) => {
        e.preventDefault()

        const menuItems = [
            {
                text: 'Удалить из списка',
                onClick: () => {
                    const removeSelectedList: number[] = props.selectedUsers.filter((item: number) => item !== user.id)
                    props.onSelectUsers(removeSelectedList)
                }
            }
        ]

        openContextMenu(e, menuItems)
    }

    const onContextMenuContact = (e: React.MouseEvent, contact: IContact) => {
        e.preventDefault()

        const menuItems = [
            {
                text: 'Удалить',
                onClick: () => {
                    const removeSelectedList: number[] = props.selectedContacts.filter((item: number) => item !== contact.id)
                    props.onSelectContacts(removeSelectedList)
                }
            }
        ]

        openContextMenu(e, menuItems)
    }

    const onContextMenuCreate = (e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = [
            {
                text: 'Из пользователей',
                onClick: () => {
                    openPopupUserSelector(document.body, {
                        selected: props.selectedUsers,
                        buttonAdd: true,
                        multi: true,
                        onSelect: (value: number[]) => props.onSelectUsers(value),
                        onAdd: () => onSave()
                    })
                }
            },
            {
                text: 'Из контактов',
                onClick: () => {
                    openPopupContactSelector(document.body, {
                        selected: props.selectedContacts,
                        multi: true,
                        onSelect: (value: number[]) => props.onSelectContacts(value),
                        onAdd: () => onSave()
                    })
                }
            }
        ]

        openContextMenu(e, menuItems)
    }

    return (
        <div className={classes.UserList}>
            <div className={classes.header}>
                <div className={classes.name}>Имя</div>
                <div className={classes.type}>Тип</div>
                <div className={classes.phone}>Телефон</div>
            </div>

            <div className={classes.addUser} onClick={onContextMenuCreate.bind(this)}>
                <FontAwesomeIcon icon='plus'/> Добавить
            </div>

            <BlockingElement fetching={fetchingUserList || fetchingContactList} className={classes.list}>
                {(selectedUsers && selectedUsers.length) || (selectedContacts && selectedContacts.length) ?
                    <>
                        {selectedUsers.map((user: IUser) => {
                            return (
                                <div key={user.id}
                                     className={classes.row}
                                     onContextMenu={(e: React.MouseEvent) => onContextMenuUser(e, user)}
                                >
                                    <div className={classes.name}>{user.firstName}</div>
                                    <div className={classes.type}>Пользователь</div>
                                    <div className={classes.phone}>{user.phone}</div>
                                </div>
                            )
                        })}

                        {selectedContacts.map((contact: IContact) => {
                            return (
                                <div key={contact.id}
                                     className={classes.row}
                                     onContextMenu={(e: React.MouseEvent) => onContextMenuContact(e, contact)}
                                >
                                    <div className={classes.name}>{contact.name}</div>
                                    <div className={classes.type}>Контакт</div>
                                    <div className={classes.phone}>{contact.phone}</div>
                                </div>
                            )
                        })}
                    </>
                    : <Empty message='Объект недвижимости не имеет контактов'/>
                }
            </BlockingElement>
        </div>
    )
}

UserList.defaultProps = defaultProps
UserList.displayName = 'UserList'

export default UserList