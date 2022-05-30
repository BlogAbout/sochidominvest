import React from 'react'
import UserItem from './components/UserItem/UserItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import {IUser} from '../../../../../@types/IUser'
import classes from './UserTill.module.scss'

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
        console.info('UserTill onClick', user)
    },
    onEdit: (user: IUser) => {
        console.info('UserTill onEdit', user)
    },
    onRemove: (user: IUser) => {
        console.info('UserTill onRemove', user)
    },
    onBlocking: (user: IUser) => {
        console.info('UserTill onBlocking', user)
    },
    onContextMenu: (e: React.MouseEvent, user: IUser) => {
        console.info('UserTill onContextMenu', e, user)
    }
}

const UserTill: React.FC<Props> = (props) => {
    return (
        <div className={classes.UserTill}>
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

UserTill.defaultProps = defaultProps
UserTill.displayName = 'UserTill'

export default UserTill