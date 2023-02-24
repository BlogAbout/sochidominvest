import React from 'react'
import {IUser} from '../../../@types/IUser'
import Empty from '../../ui/Empty/Empty'
import UserList from './components/UserList/UserList'
import UserTill from './components/UserTill/UserTill'
import classes from './UserListContainer.module.scss'

interface Props {
    users: IUser[]
    fetching: boolean
    layout: 'list' | 'till'

    onClick(user: IUser): void

    onEdit(user: IUser): void

    onRemove(user: IUser): void

    onBlocking(user: IUser): void

    onContextMenu(e: React.MouseEvent, user: IUser): void
}

const defaultProps: Props = {
    users: [],
    fetching: false,
    layout: 'list',
    onClick: (user: IUser) => {
        console.info('UserListContainer onClick', user)
    },
    onEdit: (user: IUser) => {
        console.info('UserListContainer onEdit', user)
    },
    onRemove: (user: IUser) => {
        console.info('UserListContainer onRemove', user)
    },
    onBlocking: (user: IUser) => {
        console.info('UserListContainer onBlocking', user)
    },
    onContextMenu: (e: React.MouseEvent, user: IUser) => {
        console.info('UserListContainer onContextMenu', e, user)
    }
}

const UserListContainer: React.FC<Props> = (props) => {
    const renderList = () => {
        switch (props.layout) {
            case 'list':
                return (
                    <UserList users={props.users}
                              fetching={props.fetching}
                              onClick={props.onClick}
                              onEdit={props.onEdit}
                              onRemove={props.onRemove}
                              onBlocking={props.onBlocking}
                              onContextMenu={props.onContextMenu}
                    />
                )
            case 'till':
                return (
                    <UserTill users={props.users}
                              fetching={props.fetching}
                              onClick={props.onClick}
                              onEdit={props.onEdit}
                              onRemove={props.onRemove}
                              onBlocking={props.onBlocking}
                              onContextMenu={props.onContextMenu}
                    />
                )
        }
    }

    return (
        <div className={classes.UserListContainer}>
            {props.users.length ? renderList() : <Empty message='Нет пользователей'/>}
        </div>
    )
}

UserListContainer.defaultProps = defaultProps
UserListContainer.displayName = 'UserListContainer'

export default UserListContainer