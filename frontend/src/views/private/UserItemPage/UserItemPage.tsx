import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {rolesList} from '../../../helpers/userHelper'
import {IUser} from '../../../@types/IUser'
import Button from '../../../components/Button/Button'
import Empty from '../../../components/Empty/Empty'
import Preloader from '../../../components/Preloader/Preloader'
import BlockingElement from '../../../components/BlockingElement/BlockingElement'
import openPopupUserCreate from '../../../components/PopupUserCreate/PopupUserCreate'
import classes from './UserItemPage.module.scss'

type UserItemPageParams = {
    id: string
}

const UserItemPage: React.FC = () => {
    const params = useParams<UserItemPageParams>()

    const [isUpdate, setIsUpdate] = useState(false)
    const [user, setUser] = useState<IUser>({} as IUser)

    const {users, fetching} = useTypedSelector(state => state.userReducer)
    const {fetchUserList} = useActions()

    useEffect(() => {
        if (isUpdate || !users.length) {
            fetchUserList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        if (params.id) {
            const userId = parseInt(params.id)
            const userInfo = users.find((user: IUser) => user.id === userId)

            if (userInfo) {
                setUser(userInfo)
            }
        }
    }, [users])

    // Редактирование пользователя
    const onClickEditHandler = () => {
        openPopupUserCreate(document.body, {
            user: user,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Блок статистики по недвижимости
    const renderStatisticBuilding = () => {
        return (
            <div className={classes.data}>
                <BlockingElement fetching={fetching} className={classes.container}>
                    <h3>Статистика по недвижимости</h3>
                    В разработке
                </BlockingElement>
            </div>
        )
    }

    // Блок статистики действий
    const renderStatisticAction = () => {
        return (
            <div className={classes.data}>
                <BlockingElement fetching={fetching} className={classes.container}>
                    <h3>Статистика действий</h3>
                    В разработке
                </BlockingElement>
            </div>
        )
    }

    // Блок информации
    const renderUserInfo = () => {
        const userRole = rolesList.find(item => item.key === user.role)

        return (
            <div className={classes.data}>
                <BlockingElement fetching={fetching} className={classes.container}>
                    <h3>Информация</h3>
                    <div className={classes.row}>
                        <div className={classes.label}>Имя:</div>
                        <div className={classes.param}>{user.firstName}</div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.label}>Email:</div>
                        <div className={classes.param}>{user.email}</div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.label}>Телефон:</div>
                        <div className={classes.param}>{user.phone}</div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.label}>Роль:</div>
                        <div className={classes.param}>{userRole ? userRole.text : ''}</div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.label}>Заблокирован:</div>
                        <div className={classes.param}>{user.block ? 'да' : 'нет'}</div>
                    </div>
                </BlockingElement>
            </div>
        )
    }

    return (
        <div className={classes.UserItemPage}>
            <div className={classes.Content}>
                {fetching && <Preloader/>}

                <h1>
                    <span>Пользователь: {user.firstName}</span>
                    <Button type='apply' icon='plus' onClick={onClickEditHandler.bind(this)}>Редактировать</Button>
                </h1>

                {!user || !user.id ?
                    <Empty message='Пользователь не найден'/>
                    :
                    <div className={classes.information}>
                        {renderUserInfo()}
                        {renderStatisticBuilding()}
                        {renderStatisticAction()}
                    </div>
                }
            </div>
        </div>
    )
}

UserItemPage.displayName = 'UserItemPage'

export default UserItemPage