import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import {compareText} from '../../../helpers/filterHelper'
import openPopupUserCreate from '../../../components/PopupUserCreate/PopupUserCreate'
import Button from '../../../components/Button/Button'
import UserList from '../../../components/UserList/UserList'
import SearchBox from '../../../components/SearchBox/SearchBox'
import SidebarLeft from '../../../components/SidebarLeft/SidebarLeft'
import {IUser} from '../../../@types/IUser'
import {IFilterContent} from '../../../@types/IFilter'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import classes from './UserPagePanel.module.scss'

const UserPagePanel: React.FC = () => {
    const [isUpdate, setIsUpdate] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [filterUser, setFilterUser] = useState<IUser[]>([])
    const [selectedType, setSelectedType] = useState<string[]>([])
    const [filters, setFilters] = useState({
        block: ['0']
    })

    const {users, fetching, role} = useTypedSelector(state => state.userReducer)
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
    const onSave = () => {
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

    // Добавление нового пользователя
    const onClickAddHandler = () => {
        openPopupUserCreate(document.body, {
            onSave: () => {
                onSave()
            }
        })
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

    return (
        <main className={classes.UserPagePanel}>
            <Helmet>
                <meta charSet='utf-8'/>
                <title>Пользователи - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <SidebarLeft filters={filtersContent}/>

            <div className={classes.filter}>
                <Button type={selectedType.includes('employee') ? 'regular' : 'save'}
                        icon='headset'
                        onClick={() => onClickFilterButtonHandler('employee')}
                >Сотрудники</Button>

                <Button type={selectedType.includes('partner') ? 'regular' : 'save'}
                        icon='user-tie'
                        onClick={() => onClickFilterButtonHandler('partner')}
                >Партнёры</Button>

                <Button type={selectedType.includes('client') ? 'regular' : 'save'}
                        icon='user'
                        onClick={() => onClickFilterButtonHandler('client')}
                >Клиенты</Button>

                <SearchBox value={searchText} onChange={search.bind(this)}/>
            </div>

            <div className={classes.Content}>
                <h1>
                    <span>Пользователи</span>

                    {['director', 'administrator', 'manager'].includes(role) ?
                        <Button type='apply' icon='plus' onClick={onClickAddHandler.bind(this)}>Добавить</Button>
                        : null
                    }
                </h1>

                <UserList users={filterUser} fetching={fetching} onSave={onSave.bind(this)}/>
            </div>
        </main>
    )
}

UserPagePanel.displayName = 'UserPagePanel'

export default UserPagePanel