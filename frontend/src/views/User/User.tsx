import React from 'react'
import Button from '../../components/Button/Button'
import classes from './User.module.scss'

const User: React.FC = () => {
    return (
        <main className={classes.User}>
            <div className={classes.filter}>
                <Button type='save' onClick={() => console.log('add')}>Администраторы</Button>

                <Button type='save' onClick={() => console.log('add')}>Риэлторы</Button>

                <Button type='save' onClick={() => console.log('add')}>Собственники</Button>

                <Button type='save' onClick={() => console.log('add')}>Клиенты</Button>
            </div>

            <div className={classes.Content}>
                <h1>
                    <span>Пользователи</span>
                    <Button type='apply' onClick={() => console.log('add')}>+ Добавить</Button>
                </h1>
            </div>
        </main>
    )
}

User.displayName = 'User'

export default User