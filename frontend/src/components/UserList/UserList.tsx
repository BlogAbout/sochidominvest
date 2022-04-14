import React from 'react'
import Empty from '../Empty/Empty'
import UserItem from './components/UserItem/UserItem'
import BlockingElement from '../BlockingElement/BlockingElement'
import {IUser} from '../../@types/IUser'
import classes from './UserList.module.scss'

interface Props {
    users: IUser[]
    fetching: boolean

    onSave(): void
}

const defaultProps: Props = {
    users: [],
    fetching: false,
    onSave: () => {
        console.info('UserList onSave')
    }
}

const UserList: React.FC<Props> = (props) => {
    return (
        <div className={classes.UserList}>
            <div className={classes.head}>
                <div className={classes.id}>#</div>
                <div className={classes.name}>Имя</div>
                <div className={classes.email}>Email</div>
                <div className={classes.phone}>Телефон</div>
                <div className={classes.role}>Роль</div>
            </div>

            {props.users.length ?
                (<BlockingElement fetching={props.fetching} className={classes.list}>
                    {props.users.map((user: IUser) => {
                        return (
                            <UserItem key={user.id} user={user} onSave={props.onSave.bind(this)}/>
                        )
                    })}
                </BlockingElement>)
                : <Empty message='Нет пользователей'/>
            }
        </div>
    )
}

UserList.defaultProps = defaultProps
UserList.displayName = 'UserList'

export default UserList