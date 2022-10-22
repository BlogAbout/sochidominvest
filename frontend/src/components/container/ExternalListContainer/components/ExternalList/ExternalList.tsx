import React from 'react'
import ExternalItem from './components/ExternalItem/ExternalItem'
import BlockingElement from '../../../../ui/BlockingElement/BlockingElement'
import {IUserExternal} from '../../../../../@types/IUser'
import classes from './ExternalList.module.scss'

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
        console.info('ExternalList onClick', user)
    },
    onEdit: (user: IUserExternal) => {
        console.info('ExternalList onEdit', user)
    },
    onRemove: (user: IUserExternal) => {
        console.info('ExternalList onRemove', user)
    },
    onContextMenu: (e: React.MouseEvent, user: IUserExternal) => {
        console.info('ExternalList onContextMenu', e, user)
    }
}

const ExternalList: React.FC<Props> = (props) => {
    return (
        <div className={classes.ExternalList}>
            <div className={classes.head}>
                <div className={classes.name}>Имя</div>
                <div className={classes.email}>Email</div>
                <div className={classes.phone}>Телефон</div>
            </div>

            <BlockingElement fetching={props.fetching} className={classes.list}>
                {props.users.map((user: IUserExternal) => {
                    return (
                        <ExternalItem key={user.id}
                                      user={user}
                                      onClick={props.onClick}
                                      onEdit={props.onEdit}
                                      onRemove={props.onRemove}
                                      onContextMenu={props.onContextMenu}
                        />
                    )
                })}
            </BlockingElement>
        </div>
    )
}

ExternalList.defaultProps = defaultProps
ExternalList.displayName = 'ExternalList'

export default ExternalList