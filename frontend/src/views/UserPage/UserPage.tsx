import React from 'react'
import Button from '../../components/Button/Button'
import openPopupUserCreate from '../../components/PopupUserCreate/PopupUserCreate'
import classes from './UserPage.module.scss'

const UserPage: React.FC = () => {
    const onClickAddHandler = () => {
        openPopupUserCreate(document.body, {
            onSave: () => {
                // Todo
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
            </div>
        </main>
    )
}

UserPage.displayName = 'UserPage'

export default UserPage