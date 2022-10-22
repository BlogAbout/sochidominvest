import React from 'react'
import classNames from 'classnames/bind'
import {IUserExternal} from '../../../../../../../@types/IUser'
import classes from './ExternalItem.module.scss'

interface Props {
    user: IUserExternal

    onClick(user: IUserExternal): void

    onEdit(user: IUserExternal): void

    onRemove(user: IUserExternal): void

    onContextMenu(e: React.MouseEvent, user: IUserExternal): void
}

const defaultProps: Props = {
    user: {} as IUserExternal,
    onClick: (user: IUserExternal) => {
        console.info('ExternalItem onClick', user)
    },
    onEdit: (user: IUserExternal) => {
        console.info('ExternalItem onEdit', user)
    },
    onRemove: (user: IUserExternal) => {
        console.info('ExternalItem onRemove', user)
    },
    onContextMenu: (e: React.MouseEvent, user: IUserExternal) => {
        console.info('ExternalItem onContextMenu', e, user)
    }
}

const cx = classNames.bind(classes)

const ExternalItem: React.FC<Props> = (props) => {
    return (
        <div className={cx({'ExternalItem': true, 'disabled': !props.user.active})}
             onClick={() => props.onClick(props.user)}
             onContextMenu={(e: React.MouseEvent) => props.onContextMenu(e, props.user)}
        >
            <div className={classes.name}>{props.user.name}</div>
            <div className={classes.email}>{props.user.email}</div>
            <div className={classes.phone}>{props.user.phone}</div>
        </div>
    )
}

ExternalItem.defaultProps = defaultProps
ExternalItem.displayName = 'ExternalItem'

export default ExternalItem