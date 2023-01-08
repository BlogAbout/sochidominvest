import React, {useEffect, useState} from 'react'
import {IUserExternal} from '../../../@types/IUser'
import {compareText} from '../../../helpers/filterHelper'
import UserService from '../../../api/UserService'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import ExternalUserList from './components/ExternalUserList/ExternalUserList'
import openPopupUserExternalCreate from '../../../components/popup/PopupUserExternalCreate/PopupUserExternalCreate'
import classes from './ExternalUsersPage.module.scss'

const ExternalUsersPage: React.FC = (): React.ReactElement => {
    const [fetching, setFetching] = useState(false)
    const [externalUsers, setExternalUsers] = useState<IUserExternal[]>([])
    const [searchText, setSearchText] = useState('')
    const [filterExternalUser, setFilterExternalUser] = useState<IUserExternal[]>([])
    const [isShowFilter, setIsShowFilter] = useState(false)

    useEffect(() => {
        fetchExternalUsersHandler()
    }, [])

    useEffect(() => {
        search(searchText)
    }, [externalUsers])

    const fetchExternalUsersHandler = () => {
        setFetching(true)

        UserService.fetchUsersExternal({active: [0, 1]})
            .then((response: any) => {
                setExternalUsers(response.data)
            })
            .catch((error: any) => {
                console.error('Произошла ошибка загрузки данных', error)
            })
            .finally(() => {
                setFetching(false)
            })
    }

    // Обработчик изменений
    const onSaveHandler = () => {
        fetchExternalUsersHandler()
    }

    // Поиск
    const search = (value: string) => {
        setSearchText(value)

        if (!externalUsers || !externalUsers.length) {
            setFilterExternalUser([])
        }

        if (value !== '') {
            setFilterExternalUser(externalUsers.filter((user: IUserExternal) => {
                return compareText(user.name, value) || compareText(user.phone, value) || compareText(user.email, value)
            }))
        } else {
            setFilterExternalUser(externalUsers)
        }
    }

    const onAddHandler = () => {
        openPopupUserExternalCreate(document.body, {
            onSave: () => onSaveHandler()
        })
    }

    return (
        <PanelView pageTitle='Внешние пользователи'>
            <Wrapper isFull>
                <Title type='h1'
                       onAdd={onAddHandler.bind(this)}
                       onFilter={() => setIsShowFilter(!isShowFilter)}
                       searchText={searchText}
                       onSearch={search.bind(this)}
                       className={classes.title}
                >Внешние пользователи</Title>

                <ExternalUserList list={filterExternalUser} fetching={fetching}
                                  onSave={() => fetchExternalUsersHandler()}/>
            </Wrapper>
        </PanelView>
    )
}

ExternalUsersPage.displayName = 'ExternalUsersPage'

export default React.memo(ExternalUsersPage)