import React from 'react'
import {IUser} from '../../../../@types/IUser'
import {rolesList} from '../../../../helpers/userHelper'
import openContextMenu from '../../../ContextMenu/ContextMenu'
import openPopupUserCreate from '../../../PopupUserCreate/PopupUserCreate'
import classes from './UserItem.module.scss'

interface Props {
    user: IUser
    onSave(): void
}

const defaultProps: Props = {
    user: {} as IUser,
    onSave: () => {
        console.info('UserItem onSave')
    }
}

const UserItem: React.FC<Props> = (props) => {
    // Редактирование пользователя
    const updateHandler = (user: IUser) => {
        openPopupUserCreate(document.body, {
            user: user,
            onSave: () => {
                props.onSave()
            }
        })
    }

    // Удаление пользователя
    const removeHandler = (user: IUser) => {
        // Todo
    }

    // Блокировка пользователя
    const blockingHandler = () => {
        // Todo
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()

        const menuItems = [
            {text: 'Редактировать', onClick: () => updateHandler(props.user)},
            {text: 'Удалить', onClick: () => removeHandler(props.user)}
        ]

        openContextMenu(e, menuItems)
    }

    const userRole = rolesList.find(item => item.key === props.user.role)

    return (
        <div className={classes.UserItem} onContextMenu={(e: React.MouseEvent) => onContextMenu(e)}>
            <div className={classes.id}>#{props.user.id}</div>
            <div className={classes.name}>{props.user.firstName}</div>
            <div className={classes.email}>{props.user.email}</div>
            <div className={classes.phone}>{props.user.phone}</div>
            <div className={classes.role}>{userRole ? userRole.text : ''}</div>
        </div>
    )
}

UserItem.defaultProps = defaultProps
UserItem.displayName = 'UserItem'

export default UserItem