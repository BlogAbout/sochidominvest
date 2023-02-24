import React, {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IUser} from '../../../../../@types/IUser'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../hooks/useActions'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import Empty from '../../../../ui/Empty/Empty'
import openContextMenu from '../../../../ContextMenu/ContextMenu'
import openPopupUserSelector from '../../../PopupUserSelector/PopupUserSelector'
import classes from './UserList.module.scss'

interface Props {
    selected: number[]

    onSelect(value: number[]): void
}

const defaultProps: Props = {
    selected: [],
    onSelect: (value: number[]) => {
        console.info('UserList onSelect', value)
    },
}

const UserList: React.FC<Props> = (props) => {
    const [isUpdate, setIsUpdate] = useState(true)
    const [selected, setSelected] = useState<IUser[]>([])

    const {fetching: fetchingUserList, users} = useTypedSelector(state => state.userReducer)
    const {fetchUserList} = useActions()

    useEffect(() => {
        if (!users.length || isUpdate) {
            fetchUserList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        setSelected(users.filter((user: IUser) => user.id && props.selected.includes(user.id)))
    }, [users, props.selected])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    const onContextMenu = (e: React.MouseEvent, user: IUser) => {
        e.preventDefault()

        const menuItems = [
            {
                text: 'Удалить из списка',
                onClick: () => {
                    const removeSelectedList: number[] = props.selected.filter((item: number) => item !== user.id)
                    props.onSelect(removeSelectedList)
                }
            }
        ]

        openContextMenu(e, menuItems)
    }

    return (
        <div className={classes.UserList}>
            <div className={classes.header}>
                <div className={classes.name}>Имя</div>
                <div className={classes.phone}>Телефон</div>
            </div>

            <div className={classes.addUser}
                 onClick={() => {
                     openPopupUserSelector(document.body, {
                         selected: props.selected,
                         buttonAdd: true,
                         multi: true,
                         onSelect: (value: number[]) => props.onSelect(value),
                         onAdd: () => onSave()
                     })
                 }}
            >
                <FontAwesomeIcon icon='plus'/> Добавить
            </div>

            <BlockingElement fetching={fetchingUserList} className={classes.list}>
                {selected && selected.length ?
                    selected.map((user: IUser) => {
                        return (
                            <div key={user.id}
                                 className={classes.row}
                                 onContextMenu={(e: React.MouseEvent) => onContextMenu(e, user)}
                            >
                                <div className={classes.name}>{user.firstName}</div>
                                <div className={classes.type}>Пользователь</div>
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