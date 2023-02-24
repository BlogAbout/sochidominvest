import React from 'react'
import {IUserExternal} from '../../../@types/IUser'
import Empty from '../../ui/Empty/Empty'
import ExternalList from './components/ExternalList/ExternalList'
import classes from './ExternalListContainer.module.scss'

interface Props {
    users: IUserExternal[]
    fetching: boolean

    onClick(user: IUserExternal): void

    onEdit(user: IUserExternal): void

    onRemove(user: IUserExternal): void

    onContextMenu(e: React.MouseEvent, user: IUserExternal): void
}

const defaultProps: Props = {
    users: [],
    fetching: false,
    onClick: (user: IUserExternal) => {
        console.info('ExternalListContainer onClick', user)
    },
    onEdit: (user: IUserExternal) => {
        console.info('ExternalListContainer onEdit', user)
    },
    onRemove: (user: IUserExternal) => {
        console.info('ExternalListContainer onRemove', user)
    },
    onContextMenu: (e: React.MouseEvent, user: IUserExternal) => {
        console.info('ExternalListContainer onContextMenu', e, user)
    }
}

const ExternalListContainer: React.FC<Props> = (props) => {
    return (
        <div className={classes.ExternalListContainer}>
            {props.users.length ?
                <ExternalList users={props.users}
                              fetching={props.fetching}
                              onClick={props.onClick}
                              onEdit={props.onEdit}
                              onRemove={props.onRemove}
                              onContextMenu={props.onContextMenu}
                />
                : <Empty message='Нет внешних пользователей'/>
            }
        </div>
    )
}

ExternalListContainer.defaultProps = defaultProps
ExternalListContainer.displayName = 'ExternalListContainer'

export default ExternalListContainer