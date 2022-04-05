import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import openPopupUserCreate from '../../../components/PopupUserCreate/PopupUserCreate'
import Button from '../../../components/Button/Button'
import UserList from '../../../components/UserList/UserList'
import SearchBox from '../../../components/SearchBox/SearchBox'
import {IUser} from '../../../@types/IUser'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import classes from './UserPagePanel.module.scss'

const UserPagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterUser, setFilterUser] = useState<IUser[]>([])

    const {users, fetching} = useTypedSelector(state => state.userReducer)
    const {fetchUserList} = useActions()

    useEffect(() => {
        if (isUpdate || !users.length) {
            fetchUserList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [users])

    // Обработчик изменений
    const onSave = () => {
        setIsUpdate(true)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!users || !users.length) {
            setFilterUser([])
        }

        if (value !== '') {
            setFilterUser(users.filter((user: IUser) => {
                return user.firstName.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1 ||
                    user.phone.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1 ||
                    user.email.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
            }))
        } else {
            setFilterUser(users)
        }
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
        <main className={classes.UserPagePanel}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Пользователи - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.filter}>
                <Button type='save' icon='headset' onClick={() => console.log('add')}>Сотрудники</Button>

                <Button type='save' icon='user-tie' onClick={() => console.log('add')}>Партнёры</Button>

                <Button type='save' icon='user' onClick={() => console.log('add')}>Клиенты</Button>

                <SearchBox value={searchText} onChange={search.bind(this)}/>
            </div>

            <div className={classes.Content}>
                <h1>
                    <span>Пользователи</span>
                    <Button type='apply' icon='plus' onClick={onClickAddHandler.bind(this)}>Добавить</Button>
                </h1>

                <UserList users={filterUser} fetching={fetching} onSave={onSave.bind(this)}/>
            </div>
        </main>
    )
}

UserPagePanel.displayName = 'UserPagePanel'

export default UserPagePanel