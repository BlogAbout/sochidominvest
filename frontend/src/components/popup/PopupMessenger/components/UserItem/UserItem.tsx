import React from 'react'
import {IUser} from '../../../../../@types/IUser'
import Avatar from '../../../../ui/Avatar/Avatar'
import classes from './UserItem.module.scss'

interface Props {
    user: IUser
    onClick: () => void
}

const defaultProps: Props = {
    user: {} as IUser,
    onClick: () => {
        console.info('UserItem onClick')
    }
}

const UserItem: React.FC<Props> = (props) => {
    return (
        <div className={classes.UserItem} onClick={props.onClick}>
            <Avatar href={props.user.avatar} alt={props.user.firstName} width={70} height={70}/>

            <div className={classes.name}>{props.user.firstName}</div>
        </div>
    )
}

UserItem.defaultProps = defaultProps
UserItem.displayName = 'UserItem'

export default UserItem