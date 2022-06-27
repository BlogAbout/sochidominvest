import React from 'react'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IUser} from '../../../../../../../@types/IUser'
import {getRoleUserText} from '../../../../../../../helpers/userHelper'
import Avatar from '../../../../../../ui/Avatar/Avatar'
import classes from './UserItem.module.scss'

interface Props {
    user: IUser

    onClick(user: IUser): void

    onEdit(user: IUser): void

    onRemove(user: IUser): void

    onBlocking(user: IUser): void

    onContextMenu(e: React.MouseEvent, user: IUser): void
}

const defaultProps: Props = {
    user: {} as IUser,
    onClick: (user: IUser) => {
        console.info('UserItem onClick', user)
    },
    onEdit: (user: IUser) => {
        console.info('UserItem onEdit', user)
    },
    onRemove: (user: IUser) => {
        console.info('UserItem onRemove', user)
    },
    onBlocking: (user: IUser) => {
        console.info('UserItem onBlocking', user)
    },
    onContextMenu: (e: React.MouseEvent, user: IUser) => {
        console.info('UserItem onContextMenu', e, user)
    }
}

const cx = classNames.bind(classes)

const UserItem: React.FC<Props> = (props) => {
    return (
        <div className={cx({'UserItem': true, 'block': props.user.block})}
             onClick={() => props.onClick(props.user)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.user)}
        >
            <Avatar href={props.user.avatar} alt={props.user.firstName} width={150} height={150}/>

            <div className={classes.itemContent}>
                <h2>{props.user.firstName}</h2>

                <div className={classes.row} title='Роль'>
                    <FontAwesomeIcon icon='user-check'/>
                    <span>{getRoleUserText(props.user.role)}</span>
                </div>

                <div className={classes.row} title='Должность'>
                    <FontAwesomeIcon icon='id-card'/>
                    <span>{props.user.postName || '-'}</span>
                </div>

                <div className={classes.row} title='E-mail'>
                    <FontAwesomeIcon icon='message'/>
                    <span>{props.user.email}</span>
                </div>

                <div className={classes.row} title='Телефон'>
                    <FontAwesomeIcon icon='phone'/>
                    <span>{props.user.phone}</span>
                </div>
            </div>
        </div>
    )
}

UserItem.defaultProps = defaultProps
UserItem.displayName = 'UserItem'

export default UserItem