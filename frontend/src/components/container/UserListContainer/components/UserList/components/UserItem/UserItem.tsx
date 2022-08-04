import React from 'react'
import classNames from 'classnames/bind'
import {useTypedSelector} from '../../../../../../../hooks/useTypedSelector'
import {IUser} from '../../../../../../../@types/IUser'
import {getRoleUserText} from '../../../../../../../helpers/userHelper'
import {getFormatDate} from '../../../../../../../helpers/dateHelper'
import Indicator from '../../../../../../ui/Indicator/Indicator'
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
    const {usersOnline} = useTypedSelector(state => state.userReducer)

    return (
        <div className={cx({'UserItem': true, 'block': props.user.block, 'disabled': !props.user.active})}
             onClick={() => props.onClick(props.user)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.user)}
        >
            <div className={classes.name}>
                <Indicator color={props.user.id && usersOnline.includes(props.user.id) ? 'green' : 'red'}
                           text={props.user.id && usersOnline.includes(props.user.id) ? 'Online' : `Был в сети: ${getFormatDate(props.user.lastActive)}`}
                />

                <span>{props.user.firstName}</span>
            </div>
            <div className={classes.post}>{props.user.postName || '-'}</div>
            <div className={classes.email}>{props.user.email}</div>
            <div className={classes.phone}>{props.user.phone}</div>
            <div className={classes.role}>{getRoleUserText(props.user.role)}</div>
        </div>
    )
}

UserItem.defaultProps = defaultProps
UserItem.displayName = 'UserItem'

export default UserItem