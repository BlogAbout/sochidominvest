import React from 'React'
import {IUser} from '../../../../@types/IUser'
import classes from './UserItem.module.scss'

interface Props {
    user: IUser
    onSave(): void
}

const defaultProps: Props = {
    user: {} as IUser,
    onSave: () => {
        console.info('UserItem onSave')
    }
}

const UserItem: React.FC<Props> = (props) => {
    // Создание нового пользователя
    const createHandler = () => {

    }

    // Редактирование пользователя
    const updateHandler = () => {

    }

    // Удаление пользователя
    const removeHandler = () => {

    }

    // Блокировка пользователя
    const blockingHandler = () => {

    }

    return (
        <div className={classes.UserItem}>

        </div>
    )
}

UserItem.defaultProps = defaultProps
UserItem.displayName = 'UserItem'

export default UserItem