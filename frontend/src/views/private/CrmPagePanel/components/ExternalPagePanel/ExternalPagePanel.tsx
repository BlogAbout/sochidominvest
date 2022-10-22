import React, {useEffect, useState} from 'react'
import {useTypedSelector} from '../../../../../hooks/useTypedSelector'
import {useActions} from '../../../../../hooks/useActions'
import {compareText} from '../../../../../helpers/filterHelper'
import {IUserExternal} from '../../../../../@types/IUser'
import UserService from '../../../../../api/UserService'
import PageInfo from '../../../../../components/ui/PageInfo/PageInfo'
import Title from '../../../../../components/ui/Title/Title'
import ExternalListContainer from '../../../../../components/container/ExternalListContainer/ExternalListContainer'
import openPopupAlert from '../../../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../../../components/ContextMenu/ContextMenu'
import openPopupUserExternalCreate
    from '../../../../../components/popup/PopupUserExternalCreate/PopupUserExternalCreate'
import classes from './ExternalPagePanel.module.scss'

const ExternalPagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterUser, setFilterUser] = useState<IUserExternal[]>([])
    const [fetching, setFetching] = useState(false)

    const {role, externals, fetching: fetchingUsers} = useTypedSelector(state => state.userReducer)
    const {fetchUserExternalList} = useActions()

    useEffect(() => {
        if (isUpdate || !externals || !externals.length) {
            fetchUserExternalList({active: [0, 1]})
        }

        setIsUpdate(false)
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [externals])

    // Обработчик изменений
    const onSaveHandler = () => {
        setIsUpdate(true)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!externals || !externals.length) {
            setFilterUser([])
        }

        if (value !== '') {
            setFilterUser(externals.filter((user: IUserExternal) => {
                return compareText(user.name, value) || compareText(user.phone, value) || compareText(user.email, value)
            }))
        } else {
            setFilterUser(externals)
        }
    }

    // Создание
    const onAddHandler = () => {
        openPopupUserExternalCreate(document.body, {
            onSave: onSaveHandler.bind(this)
        })
    }

    // Клик на строке
    const onClickHandler = (user: IUserExternal) => {
        // Todo
    }

    // Редактирование
    const onEditHandler = (user: IUserExternal) => {
        openPopupUserExternalCreate(document.body, {
            user: user,
            onSave: onSaveHandler.bind(this)
        })
    }

    // Удаление
    const onRemoveHandler = (user: IUserExternal) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить ${user.name}?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (user.id) {
                            setFetching(true)

                            UserService.removeUserExternal(user.id)
                                .then(() => {
                                    onSaveHandler()
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

    // Контекстное меню
    const onContextMenu = (e: React.MouseEvent, user: IUserExternal) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [
                {
                    text: 'Редактировать',
                    onClick: () => onEditHandler(user)
                },
                {
                    text: 'Удалить',
                    onClick: () => onRemoveHandler(user)
                }
            ]

            openContextMenu(e, menuItems)
        }
    }

    return (
        <main className={classes.ExternalPagePanel}>
            <PageInfo title='Внешние пользователи'/>

            <div className={classes.Content}>
                <Title type={1}
                       showAdd={['director', 'administrator', 'manager'].includes(role)}
                       onAdd={onAddHandler.bind(this)}
                >Внешние пользователи</Title>

                <ExternalListContainer users={filterUser}
                                       fetching={fetching || fetchingUsers}
                                       onClick={onClickHandler.bind(this)}
                                       onEdit={onEditHandler.bind(this)}
                                       onRemove={onRemoveHandler.bind(this)}
                                       onContextMenu={onContextMenu.bind(this)}
                />
            </div>
        </main>
    )
}

ExternalPagePanel.displayName = 'ExternalPagePanel'

export default ExternalPagePanel