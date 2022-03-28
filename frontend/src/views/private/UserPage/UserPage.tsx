import React, {useEffect, useState} from 'react'
import openPopupUserCreate from '../../../components/PopupUserCreate/PopupUserCreate'
import Button from '../../../components/Button/Button'
import UserList from '../../../components/UserList/UserList'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import classes from './UserPage.module.scss'

const UserPage: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)

    const {users, fetching} = useTypedSelector(state => state.userReducer)
    const {fetchUserList} = useActions()

    useEffect(() => {
        if (isUpdate || !users.length) {
            fetchUserList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    // Добавление нового пользователя
    const onClickAddHandler = () => {
        openPopupUserCreate(document.body, {
            onSave: () => {
                onSave()
            }
        })
    }

    return (
        <main className={classes.User}>
            <div className={classes.filter}>
                <Button type='save' icon='headset' onClick={() => console.log('add')}>Администраторы</Button>

                <Button type='save' icon='user-tie' onClick={() => console.log('add')}>Риэлторы</Button>

                <Button type='save' icon='house-user' onClick={() => console.log('add')}>Собственники</Button>

                <Button type='save' icon='user' onClick={() => console.log('add')}>Клиенты</Button>
            </div>

            <div className={classes.Content}>
                <h1>
                    <span>Пользователи</span>
                    <Button type='apply' icon='plus' onClick={onClickAddHandler.bind(this)}>Добавить</Button>
                </h1>

                <UserList users={users} fetching={fetching} onSave={onSave.bind(this)}/>
            </div>
        </main>
    )
}

UserPage.displayName = 'UserPage'

export default UserPage