import React from 'react'
import UserItem from './components/UserItem/UserItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import {IUser} from '../../../../../@types/IUser'
import classes from './UserList.module.scss'

interface Props {
    users: IUser[]
    fetching: boolean

    onClick(user: IUser): void

    onEdit(user: IUser): void

    onRemove(user: IUser): void

    onBlocking(user: IUser): void

    onContextMenu(e: React.MouseEvent, user: IUser): void
}

const defaultProps: Props = {
    users: [],
    fetching: false,
    onClick: (user: IUser) => {
        console.info('UserList onClick', user)
    },
    onEdit: (user: IUser) => {
        console.info('UserList onEdit', user)
    },
    onRemove: (user: IUser) => {
        console.info('UserList onRemove', user)
    },
    onBlocking: (user: IUser) => {
        console.info('UserList onBlocking', user)
    },
    onContextMenu: (e: React.MouseEvent, user: IUser) => {
        console.info('UserList onContextMenu', e, user)
    }
}

const UserList: React.FC<Props> = (props) => {
    return (
        <div className={classes.UserList}>
            <div className={classes.head}>
                <div className={classes.name}>Имя</div>
                <div className={classes.post}>Должность</div>
                <div className={classes.email}>Email</div>
                <div className={classes.phone}>Телефон</div>
                <div className={classes.role}>Роль</div>
            </div>

            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.users.map((user: IUser) => {
                    return (
                        <UserItem key={user.id}
                                  user={user}
                                  onClick={props.onClick}
                                  onEdit={props.onEdit}
                                  onRemove={props.onRemove}
                                  onBlocking={props.onBlocking}
                                  onContextMenu={props.onContextMenu}
                        />
                    )
                })}
            </BlockingElement>
        </div>
    )
}

UserList.defaultProps = defaultProps
UserList.displayName = 'UserList'

export default UserList