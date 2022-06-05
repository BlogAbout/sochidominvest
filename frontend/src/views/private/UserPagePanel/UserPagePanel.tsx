import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {IUser} from '../../../@types/IUser'
import {IFilterBase, IFilterContent} from '../../../@types/IFilter'
import UserService from '../../../api/UserService'
import {compareText} from '../../../helpers/filterHelper'
import {changeLayout, getLayout} from '../../../helpers/utilHelper'
import Title from '../../../components/ui/Title/Title'
import FilterBase from '../../../components/ui/FilterBase/FilterBase'
import PageInfo from '../../../components/ui/PageInfo/PageInfo'
import UserListContainer from '../../../components/container/UserListContainer/UserListContainer'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import openPopupUserCreate from '../../../components/popup/PopupUserCreate/PopupUserCreate'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import classes from './UserPagePanel.module.scss'

const UserPagePanel: React.FC = () => {
    const navigate = useNavigate()

    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterUser, setFilterUser] = useState<IUser[]>([])
    const [selectedType, setSelectedType] = useState<string[]>([])
    const [filters, setFilters] = useState({
        block: ['0']
    })
    const [layout, setLayout] = useState<'list' | 'till'>(getLayout('users'))
    const [fetching, setFetching] = useState(false)

    const {users, fetching: fetchingUser, role} = useTypedSelector(state => state.userReducer)
    const {fetchUserList} = useActions()

    useEffect(() => {
        if (isUpdate || !users.length) {
            fetchUserList({active: [0, 1]})

            setIsUpdate(false)
        }
    }, [isUpdate])

    useEffect(() => {
        search(searchText)
    }, [users, selectedType, filters])

    // Обработчик изменений
    const onSaveHandler = () => {
        setIsUpdate(true)
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!users || !users.length) {
            setFilterUser([])
        }

        let usersByType: IUser[]

        if (selectedType.length) {
            const types: string[] = []
            if (selectedType.includes('employee')) {
                types.push('director')
                types.push('administrator')
                types.push('manager')
            }
            if (selectedType.includes('partner')) {
                types.push('developer')
                types.push('investor')
                types.push('agent')
            }
            if (selectedType.includes('client')) {
                types.push('owner')
                types.push('buyer')
                types.push('subscriber')
            }

            usersByType = users.filter((user: IUser) => types.includes(user.role))
        } else {
            usersByType = users
        }

        if (value !== '') {
            setFilterUser(filterItemsHandler(usersByType.filter((user: IUser) => {
                return compareText(user.firstName, value) || compareText(user.phone, value) || compareText(user.email, value)
            })))
        } else {
            setFilterUser(filterItemsHandler(usersByType))
        }
    }

    const onChangeLayoutHandler = (value: 'list' | 'till') => {
        setLayout(value)
        changeLayout('users', value)
    }

    const onClickHandler = (user: IUser) => {
        navigate('/panel/user/' + user.id)
    }

    // Добавление нового пользователя
    const onAddHandler = () => {
        openPopupUserCreate(document.body, {
            role: role,
            onSave: () => {
                onSaveHandler()
            }
        })
    }

    // Редактирование пользователя
    const onEditHandler = (user: IUser) => {
        openPopupUserCreate(document.body, {
            user: user,
            role: role,
            onSave: () => {
                onSaveHandler()
            }
        })
    }

    // Удаление пользователя
    const onRemoveHandler = (user: IUser) => {
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

    // Блокировка пользователя
    const onBlockingHandler = (user: IUser) => {
        const userInfo: IUser = {...user}
        userInfo.block = user.block ? 0 : 1

        UserService.saveUser(userInfo)
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

    // Открытие контекстного меню на элементе
    const onContextMenu = (e: React.MouseEvent, user: IUser) => {
        e.preventDefault()

        if (['director', 'administrator', 'manager'].includes(role)) {
            const menuItems = [{
                text: 'Редактировать',
                onClick: () => onEditHandler(user)
            }]

            if (user.role !== 'director') {
                if (['director', 'administrator'].includes(role)) {
                    menuItems.push({
                        text: user.block ? 'Разблокировать' : 'Заблокировать',
                        onClick: () => onBlockingHandler(user)
                    })
                    menuItems.push({
                        text: 'Удалить',
                        onClick: () => onRemoveHandler(user)
                    })
                }
            }

            openContextMenu(e, menuItems)
        }
    }

    // Кнопки базовой фильтрации
    const onClickFilterButtonHandler = (type: string) => {
        if (selectedType.includes(type)) {
            setSelectedType(selectedType.filter((item: string) => item !== type))
        } else {
            setSelectedType([type, ...selectedType])
        }
    }

    // Фильтрация элементов на основе установленных фильтров
    const filterItemsHandler = (list: IUser[]) => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IUser) => {
            return filters.block.includes(String(item.block))
        })
    }

    const filtersContent: IFilterContent[] = [
        {
            title: 'Тип пользователя',
            type: 'checker',
            multi: true,
            items: [
                {key: '0', text: 'Не заблокированные'},
                {key: '1', text: 'Заблокированные'}
            ],
            selected: filters.block,
            onSelect: (values: string[]) => {
                setFilters({...filters, block: values})
            }
        }
    ]

    const filterBaseButtons: IFilterBase[] = [
        {
            key: 'employee',
            title: 'Сотрудники',
            icon: 'headset',
            active: selectedType.includes('employee'),
            onClick: onClickFilterButtonHandler.bind(this)
        },
        {
            key: 'partner',
            title: 'Партнёры',
            icon: 'user-tie',
            active: selectedType.includes('partner'),
            onClick: onClickFilterButtonHandler.bind(this)
        },
        {
            key: 'client',
            title: 'Клиенты',
            icon: 'user',
            active: selectedType.includes('client'),
            onClick: onClickFilterButtonHandler.bind(this)
        }
    ]

    return (
        <main className={classes.UserPagePanel}>
            <PageInfo title='Пользователи'/>

            <SidebarLeft filters={filtersContent}/>

            <FilterBase buttons={filterBaseButtons} valueSearch={searchText} onSearch={search.bind(this)} showSearch/>

            <div className={classes.Content}>
                <Title type={1}
                       layout={layout}
                       showAdd={['director', 'administrator', 'manager'].includes(role)}
                       onAdd={onAddHandler.bind(this)}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                       showChangeLayout
                >Пользователи</Title>

                <UserListContainer users={filterUser}
                                   fetching={fetching || fetchingUser}
                                   layout={layout}
                                   onClick={onClickHandler.bind(this)}
                                   onEdit={onEditHandler.bind(this)}
                                   onRemove={onRemoveHandler.bind(this)}
                                   onBlocking={onBlockingHandler.bind(this)}
                                   onContextMenu={onContextMenu.bind(this)}
                />
            </div>
        </main>
    )
}

UserPagePanel.displayName = 'UserPagePanel'

export default UserPagePanel