import React, {useEffect, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {rolesList} from '../../../helpers/userHelper'
import {useActions} from '../../../hooks/useActions'
import {compareText} from '../../../helpers/filterHelper'
import {changeLayout, getLayout} from '../../../helpers/utilHelper'
import {allowForRole} from '../../helpers/accessHelper'
import {IUser} from '../../../@types/IUser'
import {IFilterContent} from '../../../@types/IFilter'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import UserService from '../../../api/UserService'
import SidebarLeft from '../../../components/ui/SidebarLeft/SidebarLeft'
import UserList from './components/UserList/UserList'
import UserTill from './components/UserTill/UserTill'
import openPopupUserCreate from '../../../components/popup/PopupUserCreate/PopupUserCreate'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import classes from './UsersPage.module.scss'

const UsersPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [fetching, setFetching] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterUser, setFilterUser] = useState<IUser[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [filters, setFilters] = useState({
        types: ['subscriber', 'manager', 'administrator', 'director'],
        block: ['0', '1']
    })
    const [layout, setLayout] = useState<'list' | 'till'>(getLayout('users'))

    const {users, fetching: fetchingUser, user} = useTypedSelector(state => state.userReducer)
    const {fetchUserList} = useActions()

    useEffect(() => {
        fetchUsersHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [users, filters])

    const fetchUsersHandler = () => {
        fetchUserList({active: [0, 1]})
    }

    // Обработчик изменений
    const onSaveHandler = () => {
        fetchUsersHandler()
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!users || !users.length) {
            setFilterUser([])
        }

        if (value !== '') {
            setFilterUser(filterItemsHandler(users.filter((user: IUser) => {
                return compareText(user.firstName, value) || compareText(user.phone, value) || compareText(user.email, value)
            })))
        } else {
            setFilterUser(filterItemsHandler(users))
        }
    }

    const onClickHandler = (user: IUser) => {
        navigate('/panel/user/' + user.id)
    }

    const onAddHandler = () => {
        openPopupUserCreate(document.body, {
            role: user.role,
            onSave: () => {
                onSaveHandler()
            }
        })
    }

    // Редактирование
    const onEditHandler = (userEdit: IUser) => {
        openPopupUserCreate(document.body, {
            user: userEdit,
            role: user.role,
            onSave: () => {
                onSaveHandler()
            }
        })
    }

    // Удаление
    const onRemoveHandler = (userRemove: IUser) => {
        openPopupAlert(document.body, {
            text: `Вы действительно хотите удалить "${userRemove.firstName}"?`,
            buttons: [
                {
                    text: 'Удалить',
                    onClick: () => {
                        if (user.id) {
                            setFetching(true)

                            UserService.removeUser(user.id)
                                .then(() => onSaveHandler())
                                .catch((error: any) => {
                                    openPopupAlert(document.body, {
                                        title: 'Ошибка!',
                                        text: error.data
                                    })
                                })
                                .finally(() => setFetching(false))
                        }
                    }
                },
                {text: 'Отмена'}
            ]
        })
    }

    // Блокировка пользователя
    const onBlockingHandler = (userBlock: IUser) => {
        const userInfo: IUser = {...userBlock}
        userInfo.block = userBlock.block ? 0 : 1

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
    const onContextMenuHandler = (userItem: IUser, e: React.MouseEvent) => {
        e.preventDefault()

        if (allowForRole(['director', 'administrator', 'manager'], user.role)) {
            const menuItems = [{
                text: 'Редактировать',
                onClick: () => onEditHandler(userItem)
            }]

            if (userItem.role !== 'director') {
                if (allowForRole(['director', 'administrator'], user.role)) {
                    menuItems.push({
                        text: userItem.block ? 'Разблокировать' : 'Заблокировать',
                        onClick: () => onBlockingHandler(userItem)
                    })
                    menuItems.push({
                        text: 'Удалить',
                        onClick: () => onRemoveHandler(userItem)
                    })
                }
            }

            openContextMenu(e, menuItems)
        }
    }

    const onChangeLayoutHandler = (value: 'list' | 'till') => {
        setLayout(value)
        changeLayout('users', value)
    }

    // Фильтрация элементов на основе установленных фильтров
    const filterItemsHandler = (list: IUser[]) => {
        if (!list || !list.length) {
            return []
        }

        return list.filter((item: IUser) => {
            return filters.types.includes(item.role) && filters.block.includes(String(item.block))
        })
    }

    const filtersContent: IFilterContent[] = useMemo(() => {
        return [
            {
                title: 'Роль',
                type: 'checker',
                multi: true,
                items: rolesList,
                selected: filters.types,
                onSelect: (values: string[]) => {
                    setFilters({...filters, types: values})
                }
            },
            {
                title: 'Заблокированные',
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
    }, [filters])

    return (
        <PanelView pageTitle='Пользователи'>
            <SidebarLeft filters={filtersContent}
                         isShow={isShowFilter}
                         onChangeShow={(isShow: boolean) => setIsShowFilter(isShow)}
            />

            <Wrapper isFull>
                <Title type='h1'
                       onAdd={onAddHandler.bind(this)}
                       onFilter={() => setIsShowFilter(!isShowFilter)}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                       layouts={['list', 'till']}
                       activeLayout={layout}
                       onChangeLayout={onChangeLayoutHandler.bind(this)}
                >Пользователи</Title>

                {layout === 'till'
                    ? <UserTill list={filterUser}
                                fetching={fetching}
                                onClick={(user: IUser) => onClickHandler(user)}
                                onContextMenu={(user: IUser, e: React.MouseEvent) => onContextMenuHandler(user, e)}
                    />
                    : <UserList list={filterUser}
                                fetching={fetching}
                                onClick={(user: IUser) => onClickHandler(user)}
                                onContextMenu={(user: IUser, e: React.MouseEvent) => onContextMenuHandler(user, e)}
                    />
                }
            </Wrapper>
        </PanelView>
    )
}

UsersPage.displayName = 'UsersPage'

export default React.memo(UsersPage)