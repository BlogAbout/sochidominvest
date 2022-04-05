import React, {useState} from 'react'
import classNames from 'classnames/bind'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../../hooks/useTypedSelector'
import {IUser} from '../../../../@types/IUser'
import {rolesList} from '../../../../helpers/userHelper'
import UserService from '../../../../api/UserService'
import openContextMenu from '../../../ContextMenu/ContextMenu'
import openPopupUserCreate from '../../../PopupUserCreate/PopupUserCreate'
import openPopupAlert from '../../../PopupAlert/PopupAlert'
import Preloader from '../../../Preloader/Preloader'
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

const cx = classNames.bind(classes)

const UserItem: React.FC<Props> = (props) => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(false)

    const {role} = useTypedSelector(state => state.userReducer)

    // Редактирование пользователя
    const updateHandler = (user: IUser) => {
        openPopupUserCreate(document.body, {
            user: user,
            onSave: () => {
                props.onSave()
            }
        })
    }

    // Удаление пользователя
    const removeHandler = (user: IUser) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${user.firstName}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (user.id) {
                            setFetching(true)

                            UserService.removeUser(user.id)
                                .then(() => {
                                    props.onSave()
                                })
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data
                                    })
                                })
                                .finally(() => {
                                    setFetching(false)
                                })
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Блокировка пользователя
    const blockingHandler = () => {
        const user: IUser = {...props.user}
        user.block = user.block ? 0 : 1

        UserService.saveUser(user)
            .then(() => {
                props.onSave()
            })
            .catch((error: any) => {
                openPopupAlert(document.body, {
                    title: 'Ошибка!',
                    text: error.data
                })
            })
            .finally(() => {
                setFetching(false)
            })
    }

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{
                text: 'Редактировать',
                onClick: () => updateHandler(props.user)
            }]

            if (props.user.role !== 'director') {
                if (['director', 'administrator'].includes(role)) {
                    menuItems.push({
                        text: props.user.block ? 'Разблокировать' : 'Заблокировать',
                        onClick: () => blockingHandler()
                    })
                    menuItems.push({
                        text: 'Удалить',
                        onClick: () => removeHandler(props.user)
                    })
                }
            }

            openContextMenu(e, menuItems)
        }
    }

    const userRole = rolesList.find(item => item.key === props.user.role)

    return (
        <div className={cx({'UserItem': true, 'block': props.user.block})}
             onClick={() => navigate('/panel/user/' + props.user.id)}
             onContextMenu={(e: React.MouseEvent) => onContextMenu(e)}
        >
            {fetching && <Preloader/>}

            <div className={classes.id}>#{props.user.id}</div>
            <div className={classes.name}>{props.user.firstName}</div>
            <div className={classes.email}>{props.user.email}</div>
            <div className={classes.phone}>{props.user.phone}</div>
            <div className={classes.role}>{userRole ? userRole.text : ''}</div>
        </div>
    )
}

UserItem.defaultProps = defaultProps
UserItem.displayName = 'UserItem'

export default UserItem