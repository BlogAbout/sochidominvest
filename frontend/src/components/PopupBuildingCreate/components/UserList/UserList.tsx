import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IUser} from '../../../../@types/IUser'
import {useTypedSelector} from '../../../../hooks/useTypedSelector'
import {useActions} from '../../../../hooks/useActions'
import BlockingElement from '../../../ui/BlockingElement/BlockingElement'
import Empty from '../../../Empty/Empty'
import openPopupAlert from '../../../PopupAlert/PopupAlert'
import openContextMenu from '../../../ContextMenu/ContextMenu'
import openPopupUserSelector from '../../../PopupUserSelector/PopupUserSelector'
import Preloader from '../../../Preloader/Preloader'
import classes from './UserList.module.scss'

interface Props {
    selected: number[]

    onSelect(value: number[]): void
}

const defaultProps: Props = {
    selected: [],
    onSelect: (value: number[]) => {
        console.info('UserList onSelect', value)
    }
}

const UserList: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(true)
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>([])

    const {fetching: fetchingUserList, users} = useTypedSelector(state => state.userReducer)
    const {fetchUserList} = useActions()

    useEffect(() => {
        if (!users.length || isUpdate) {
            fetchUserList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        setSelectedUsers(users.filter((user: IUser) => user.id && props.selected.includes(user.id)))
    }, [users, props.selected])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    // Добавление элемента из списка
    const selectHandler = () => {
        openPopupUserSelector(document.body, {
            selected: props.selected,
            buttonAdd: true,
            multi: true,
            onSelect: (value: number[]) => props.onSelect(value),
            onAdd: () => onSave()
        })
    }

    // Удаление элемента из списка
    const removeHandler = (user: IUser) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${user.firstName} из списка выбранных?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        const removeSelectedList: number[] = props.selected.filter((item: number) => item !== user.id)
                        props.onSelect(removeSelectedList)
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent, user: IUser) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Удалить', onClick: () => removeHandler(user)}
        ]

        openContextMenu(e, menuItems)
    }

    return (
        <div className={classes.UserList}>
            {fetchingUserList && <Preloader/>}

            <div className={classes.header}>
                <div className={classes.name}>Имя</div>
                <div className={classes.phone}>Телефон</div>
            </div>

            <div className={classes.addUser} onClick={selectHandler.bind(this)}>
                <FontAwesomeIcon icon='plus'/> Добавить
            </div>

            <BlockingElement fetching={fetchingUserList} className={classes.list}>
                {selectedUsers && selectedUsers.length ?
                    selectedUsers.map((user: IUser) => {
                        return (
                            <div key={user.id}
                                 className={classes.row}
                                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, user)}
                            >
                                <div className={classes.name}>{user.firstName}</div>
                                <div className={classes.phone}>{user.phone}</div>
                            </div>
                        )
                    })
                    : <Empty message='Объект недвижимости не имеет контактов'/>
                }
            </BlockingElement>
        </div>
    )
}

UserList.defaultProps = defaultProps
UserList.displayName = 'UserList'

export default UserList