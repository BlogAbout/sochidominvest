import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import {useParams} from 'react-router-dom'
import BuildingService from '../../../api/BuildingService'
import ArticleService from '../../../api/ArticleService'
import UtilService from '../../../api/UtilService'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {rolesList} from '../../../helpers/userHelper'
import {IUser} from '../../../@types/IUser'
import {IBuilding} from '../../../@types/IBuilding'
import {IArticle} from '../../../@types/IArticle'
import {ILog} from '../../../@types/ILog'
import Button from '../../../components/form/Button/Button'
import Empty from '../../../components/Empty/Empty'
import Preloader from '../../../components/Preloader/Preloader'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import InfoList from '../DesktopPagePanel/components/InfoList/InfoList'
import openPopupUserCreate from '../../../components/popup/PopupUserCreate/PopupUserCreate'
import classes from './UserItemPagePanel.module.scss'

type UserItemPageParams = {
    id: string
}

const UserItemPagePanel: React.FC = () => {
    const params = useParams<UserItemPageParams>()

    const [isUpdate, setIsUpdate] = useState(false)
    const [isUpdateContent, setIsUpdateContent] = useState({
        building: false,
        article: false,
        log: false
    })
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
                setIsUpdateContent({building: true, article: true, log: true})
            }
        }
    }, [users])

    useEffect(() => {
        if (isUpdateContent.building && user.id) {
            setIsUpdateContent({...isUpdateContent, building: false})
            setFetchingBuildings(true)

            BuildingService.fetchBuildings({active: [1], author: [user.id]})
                .then((response: any) => {
                    setBuildings(response.data)
                })
                .catch((error: any) => {
                    console.error(error)
                })
                .finally(() => {
                    setFetchingBuildings(false)
                })
        }

        if (isUpdateContent.article && user.id) {
            setIsUpdateContent({...isUpdateContent, article: false})
            setFetchingArticles(true)

            ArticleService.fetchArticles({active: [1], author: [user.id]})
                .then((response: any) => {
                    setArticles(response.data)
                })
                .catch((error: any) => {
                    console.error(error)
                })
                .finally(() => {
                    setFetchingArticles(false)
                })
        }

        if (isUpdateContent.log && user.id) {
            setIsUpdateContent({...isUpdateContent, log: false})
            setFetchingLogs(true)

            UtilService.fetchLogs({active: [1], userId: [user.id]})
                .then((response: any) => {
                    setLogs(response.data)
                })
                .catch((error: any) => {
                    console.error(error)
                })
                .finally(() => {
                    setFetchingLogs(false)
                })
        }

    }, [isUpdateContent])

    // Редактирование пользователя
    const onClickEditHandler = () => {
        openPopupUserCreate(document.body, {
            user: user,
            role: role,
            onSave: () => {
                setIsUpdate(true)
            }
        })
    }

    // Блок статистики по недвижимости
    const renderStatisticBuilding = () => {
        return (
            <div className={classes.data}>
                <h3>Статистика по недвижимости</h3>

                <InfoList type='building'
                          buildings={buildings}
                          fetching={fetchingBuildings}
                          onSave={() => setIsUpdateContent({...isUpdateContent, building: true})}
                />
            </div>
        )
    }

    // Блок статистики по статьям
    const renderStatisticArticle = () => {
        return (
            <div className={classes.data}>
                <h3>Статистика по статьям</h3>

                <InfoList type='article'
                          articles={articles}
                          fetching={fetchingArticles}
                          onSave={() => setIsUpdateContent({...isUpdateContent, article: true})}
                />
            </div>
        )
    }

    // Блок статистики действий
    const renderStatisticAction = () => {
        return (
            <div className={classes.data}>
                <h3>Статистика действий</h3>

                <InfoList type='log'
                          logs={logs}
                          fetching={fetchingLogs}
                          onSave={() => setIsUpdateContent({...isUpdateContent, log: true})}
                />
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
                        <div className={classes.label}>Заблокирован:</div>
                        <div className={classes.param}>{user.block ? 'да' : 'нет'}</div>
                    </div>
                </BlockingElement>
            </div>
        )
    }

    return (
        <div className={classes.UserItemPagePanel}>
            <Helmet>
                <meta charSet='utf-8'/>
                <title>{!user ? 'Пользователи - СочиДомИнвест' : `${user.firstName} - СочиДомИнвест`}</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                {fetching && <Preloader/>}

                <h1>
                    <span>Пользователь: {user.firstName}</span>

                    {['director', 'administrator', 'manager'].includes(role) ?
                        <Button type='apply' icon='plus' onClick={onClickEditHandler.bind(this)}>Редактировать</Button>
                        : null
                    }
                </h1>

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
            </div>
        </div>
    )
}

UserItemPagePanel.displayName = 'UserItemPagePanel'

export default UserItemPagePanel