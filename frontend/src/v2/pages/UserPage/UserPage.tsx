import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {rolesList} from '../../../helpers/userHelper'
import {getTariffText} from '../../../helpers/tariffHelper'
import {getFormatDate} from '../../../helpers/dateHelper'
import {IUser} from '../../../@types/IUser'
import {IBuilding} from '../../../@types/IBuilding'
import {IArticle} from '../../../@types/IArticle'
import {ILog} from '../../../@types/ILog'
import UtilService from '../../../api/UtilService'
import BuildingService from '../../../api/BuildingService'
import ArticleService from '../../../api/ArticleService'
import PanelView from '../../views/PanelView/PanelView'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import Title from '../../components/ui/Title/Title'
import InfoList from '../DesktopPage/components/InfoList/InfoList'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Preloader from '../../../components/ui/Preloader/Preloader'
import Empty from '../../../components/ui/Empty/Empty'
import openPopupUserCreate from '../../../components/popup/PopupUserCreate/PopupUserCreate'
import classes from './UserPage.module.scss'

type UserItemPageParams = {
    id: string
}

const UserPage: React.FC = (): React.ReactElement => {
    const params = useParams<UserItemPageParams>()

    const [user, setUser] = useState<IUser>({} as IUser)
    const [buildings, setBuildings] = useState<IBuilding[]>([])
    const [articles, setArticles] = useState<IArticle[]>([])
    const [logs, setLogs] = useState<ILog[]>([])
    const [fetchingBuildings, setFetchingBuildings] = useState(false)
    const [fetchingArticles, setFetchingArticles] = useState(false)
    const [fetchingLogs, setFetchingLogs] = useState(false)

    const {users, fetching, role} = useTypedSelector(state => state.userReducer)
    const {fetchUserList} = useActions()

    useEffect(() => {
        fetchUsersHandler()
    }, [])

    useEffect(() => {
        if (params.id) {
            const userId = parseInt(params.id)
            const userInfo = users.find((user: IUser) => user.id === userId)

            if (userInfo) {
                setUser(userInfo)
            }
        }
    }, [users])

    useEffect(() => {
        fetchBuildingsHandler()
        fetchArticlesHandler()
        fetchLogHandler()
    }, [user.id])

    const fetchUsersHandler = () => {
        fetchUserList({active: [0, 1]})
    }

    const fetchBuildingsHandler = () => {
        if (!user.id) {
            return
        }

        setFetchingBuildings(true)

        BuildingService.fetchBuildings({active: [1], author: [user.id]})
            .then((response: any) => setBuildings(response.data))
            .catch((error: any) => {
                console.error(error)
            })
            .finally(() => setFetchingBuildings(false))
    }

    const fetchArticlesHandler = () => {
        if (!user.id) {
            return
        }

        setFetchingArticles(true)

        ArticleService.fetchArticles({active: [1], author: [user.id]})
            .then((response: any) => setArticles(response.data))
            .catch((error: any) => {
                console.error(error)
            })
            .finally(() => setFetchingArticles(false))
    }

    const fetchLogHandler = () => {
        if (!user.id) {
            return
        }

        setFetchingLogs(true)

        UtilService.fetchLogs({active: [1], userId: [user.id]})
            .then((response: any) => setLogs(response.data))
            .catch((error: any) => {
                console.error(error)
            })
            .finally(() => setFetchingLogs(false))
    }

    // Редактирование пользователя
    const onClickEditHandler = () => {
        openPopupUserCreate(document.body, {
            user: user,
            role: role,
            onSave: () => fetchUsersHandler()
        })
    }

    // Блок статистики по недвижимости
    const renderStatisticBuilding = (): React.ReactElement => {
        return (
            <div className={classes.data}>
                <Title type='h2'>Статистика по недвижимости</Title>

                <InfoList type='building'
                          buildings={buildings}
                          fetching={fetchingBuildings}
                          onSave={() => fetchBuildingsHandler()}
                />
            </div>
        )
    }

    // Блок статистики по статьям
    const renderStatisticArticle = (): React.ReactElement => {
        return (
            <div className={classes.data}>
                <Title type='h2'>Статистика по статьям</Title>

                <InfoList type='article'
                          articles={articles}
                          fetching={fetchingArticles}
                          onSave={() => fetchArticlesHandler()}
                />
            </div>
        )
    }

    // Блок статистики действий
    const renderStatisticAction = (): React.ReactElement => {
        return (
            <div className={classes.data}>
                <Title type='h2'>Статистика действий</Title>

                <InfoList type='log'
                          logs={logs}
                          fetching={fetchingLogs}
                          onSave={() => fetchLogHandler()}
                />
            </div>
        )
    }

    // Блок информации
    const renderUserInfo = (): React.ReactElement => {
        const userRole = rolesList.find(item => item.key === user.role)

        return (
            <div className={classes.data}>
                <BlockingElement fetching={fetching} className={classes.container}>
                    <Title type='h2'>Информация</Title>

                    <div className={classes.row}>
                        <div className={classes.label}>Имя:</div>
                        <div className={classes.param}>{user.firstName}</div>
                    </div>
                    {user.post ?
                        <div className={classes.row}>
                            <div className={classes.label}>Должность:</div>
                            <div className={classes.param}>{user.postName}</div>
                        </div>
                        : null}
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
                        <div className={classes.label}>Тариф:</div>
                        <div className={classes.param}>{getTariffText(user.tariff)}</div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.label}>Дата окончания тарифа:</div>
                        <div className={classes.param}>
                            {user.tariff !== 'free' ? getFormatDate(user.tariffExpired) : 'Бессрочно'}
                        </div>
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
        <PanelView pageTitle={!user ? 'Пользователи' : user.firstName}>
            <Wrapper isFull>
                <Title type='h1'
                       addText='Редактировать'
                       onAdd={onClickEditHandler.bind(this)}
                       className={classes.title}
                >{!user ? 'Пользователи' : user.firstName}</Title>

                {fetching && <Preloader/>}

                {!user || !user.id ?
                    <Empty message='Пользователь не найден'/>
                    :
                    <div className={classes.information}>
                        {renderUserInfo()}
                        {renderStatisticBuilding()}
                        {renderStatisticArticle()}
                        {renderStatisticAction()}
                    </div>
                }
            </Wrapper>
        </PanelView>
    )
}

UserPage.displayName = 'UserPage'

export default React.memo(UserPage)