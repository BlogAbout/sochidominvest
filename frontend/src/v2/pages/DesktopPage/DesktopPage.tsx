import React, {useEffect, useState} from 'react'
import classNames from 'classnames/bind'
import {useNavigate} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {allowForRole, allowForTariff} from '../../helpers/accessHelper'
import {getTariffText} from '../../../helpers/tariffHelper'
import {getFormatDate} from '../../../helpers/dateHelper'
import {RouteNames} from '../../helpers/routerHelper'
import {IUser} from '../../../@types/IUser'
import {IFeed} from '../../../@types/IFeed'
import {IAgent} from '../../../@types/IAgent'
import {IDeveloper} from '../../../@types/IDeveloper'
import {IArticle} from '../../../@types/IArticle'
import UserService from '../../../api/UserService'
import FeedService from '../../../api/FeedService'
import DeveloperService from '../../../api/DeveloperService'
import AgentService from '../../../api/AgentService'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import PanelView from '../../views/PanelView/PanelView'
import Avatar from '../../../components/ui/Avatar/Avatar'
import Empty from '../../../components/Empty/Empty'
import openPopupSupportInfo from '../../../components/popup/PopupSupportInfo/PopupSupportInfo'
import openPopupAgentCreate from '../../../components/popup/PopupAgentCreate/PopupAgentCreate'
import openPopupAlert from '../../../components/PopupAlert/PopupAlert'
import openPopupDeveloperCreate from '../../../components/popup/PopupDeveloperCreate/PopupDeveloperCreate'
import openContextMenu from '../../../components/ContextMenu/ContextMenu'
import classes from './DesktopPage.module.scss'

const cx = classNames.bind(classes)

const DesktopPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [userInfo, setUserInfo] = useState<IUser>({} as IUser)
    const [tickets, setTickets] = useState<IFeed[]>([])
    const [deals, setDeals] = useState([])
    const [agents, setAgents] = useState<IAgent[]>([])
    const [developers, setDevelopers] = useState<IDeveloper[]>([])
    const [filterArticles, setFilterArticles] = useState<IArticle[]>([])

    const [fetchingUser, setFetchingUser] = useState(false)
    const [fetchingTickets, setFetchingTickets] = useState(false)
    const [fetchingDeals, setFetchingDeals] = useState(false)
    const [fetchingAgents, setFetchingAgents] = useState(false)
    const [fetchingDevelopers, setFetchingDevelopers] = useState(false)

    const {userId} = useTypedSelector(state => state.userReducer)
    const {articles, fetching: fetchingArticles} = useTypedSelector(state => state.articleReducer)
    const {fetchArticleList} = useActions()

    useEffect(() => {
        fetchArticlesHandler()
    }, [])

    useEffect(() => {
        fetchUserHandler()
    }, [userId])

    useEffect(() => {
        fetchFeedsHandler()

        if (allowForRole(['subscriber']) && allowForTariff(['business', 'effectivePlus'])) {
            fetchDevelopersHandler()
            fetchAgentsHandler()
        }
    }, [userInfo])

    useEffect(() => {
        if (!articles || !articles.length) {
            setFilterArticles([])
        } else {
            setFilterArticles(articles.filter((article: IArticle) => article.active === 1))
        }
    }, [articles])

    const fetchArticlesHandler = () => {
        fetchArticleList({active: [0, 1]})
    }

    // Загрузка данных пользователя
    const fetchUserHandler = () => {
        let findUserId = userId

        if (!userId) {
            const localStorageUserId = localStorage.getItem('id') || ''

            if (localStorageUserId) {
                findUserId = parseInt(localStorageUserId)
            }
        }

        if (findUserId) {
            setFetchingUser(true)

            UserService.fetchUserById(findUserId)
                .then((response: any) => setUserInfo(response.data))
                .catch((error: any) => {
                    console.error('Ошибка загрузки данных пользователя', error)
                })
                .finally(() => setFetchingUser(false))
        }
    }

    // Загрузка данных о тикетах пользователя
    const fetchFeedsHandler = () => {
        if (!userInfo || !userInfo.id) {
            return
        }

        setFetchingTickets(true)

        FeedService.fetchFeeds({active: [1], author: [userInfo.id]})
            .then((response: any) => setTickets(response.data))
            .catch((error: any) => {
                console.error('Ошибка загрузки тикетов пользователя', error)
            })
            .finally(() => setFetchingTickets(false))
    }

    // Загрузка данных о застройщиках пользователя
    const fetchDevelopersHandler = () => {
        setFetchingDevelopers(true)

        DeveloperService.fetchDevelopers({active: [0, 1], author: [userId]})
            .then((response: any) => setDevelopers(response.data))
            .catch((error: any) => {
                console.error('Ошибка загрузки застройщиков пользователя', error)
            })
            .finally(() => setFetchingDevelopers(false))
    }

    // Загрузка данных об агентствах пользователя
    const fetchAgentsHandler = () => {
        setFetchingAgents(true)

        AgentService.fetchAgents({active: [0, 1], author: [userId]})
            .then((response: any) => setAgents(response.data))
            .catch((error: any) => {
                console.error('Ошибка загрузки агентств пользователя', error)
            })
            .finally(() => setFetchingAgents(false))
    }

    const onContextMenuAgent = (e: React.MouseEvent, agent: IAgent) => {
        e.preventDefault()

        const menuItems = [
            {
                text: 'Редактировать',
                onClick: () => {
                    openPopupAgentCreate(document.body, {
                        agent: agent,
                        onSave: () => fetchAgentsHandler()
                    })
                }
            },
            {
                text: 'Удалить',
                onClick: () => {
                    openPopupAlert(document.body, {
                        text: `Вы действительно хотите удалить ${agent.name}?`,
                        buttons: [
                            {
                                text: 'Удалить',
                                onClick: () => {
                                    if (agent.id) {
                                        setFetchingAgents(true)

                                        AgentService.removeAgent(agent.id)
                                            .then(() => fetchAgentsHandler())
                                            .catch((error: any) => {
                                                openPopupAlert(document.body, {
                                                    title: 'Ошибка!',
                                                    text: error.data
                                                })
                                            })
                                            .finally(() => setFetchingAgents(false))
                                    }
                                }
                            },
                            {text: 'Отмена'}
                        ]
                    })
                }
            }
        ]

        openContextMenu(e, menuItems)
    }

    const onContextMenuDeveloper = (e: React.MouseEvent, developer: IDeveloper) => {
        e.preventDefault()

        const menuItems = [
            {
                text: 'Редактировать',
                onClick: () => {
                    openPopupDeveloperCreate(document.body, {
                        developer: developer,
                        onSave: () => fetchDevelopersHandler()
                    })
                }
            },
            {
                text: 'Удалить',
                onClick: () => {
                    openPopupAlert(document.body, {
                        text: `Вы действительно хотите удалить ${developer.name}?`,
                        buttons: [
                            {
                                text: 'Удалить',
                                onClick: () => {
                                    if (developer.id) {
                                        setFetchingDevelopers(true)

                                        AgentService.removeAgent(developer.id)
                                            .then(() => fetchDevelopersHandler())
                                            .catch((error: any) => {
                                                openPopupAlert(document.body, {
                                                    title: 'Ошибка!',
                                                    text: error.data
                                                })
                                            })
                                            .finally(() => setFetchingDevelopers(false))
                                    }
                                }
                            },
                            {text: 'Отмена'}
                        ]
                    })
                }
            }
        ]

        openContextMenu(e, menuItems)
    }

    const renderUserInfo = (): React.ReactElement => {
        return (
            <div className={cx({'col': true, 'col-3': true})}>
                <Title type='h2'>Личная информация</Title>

                <BlockingElement fetching={fetchingUser} className={classes.list}>
                    <div className={cx({'block': true, 'noClick': true})}>
                        <Avatar href={userInfo.avatar}
                                alt={userInfo.firstName}
                                width={110}
                                height={110}
                        />

                        <div className={classes.meta}>
                            <div className={classes.row}>
                                <div className={classes.label}>Имя:</div>
                                <div className={classes.param}>{userInfo.firstName}</div>
                            </div>
                            {userInfo.post ?
                                <div className={classes.row}>
                                    <div className={classes.label}>Должность:</div>
                                    <div className={classes.param}>{userInfo.postName}</div>
                                </div>
                                : null}
                            <div className={classes.row}>
                                <div className={classes.label}>Email:</div>
                                <div className={classes.param}>{userInfo.email}</div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.label}>Телефон:</div>
                                <div className={classes.param}>{userInfo.phone}</div>
                            </div>
                        </div>
                    </div>
                </BlockingElement>
            </div>
        )
    }

    const renderTariffsInfo = (): React.ReactElement | null => {
        if (!userInfo || !allowForRole(['subscriber'])) {
            return null
        }

        return (
            <div className={cx({'col': true, 'col-3': true})}>
                <Title type='h2'>Тарифный план</Title>

                <BlockingElement fetching={fetchingUser} className={classes.list}>
                    <div className={classes.row}>
                        <div className={classes.label}>Текущий тариф:</div>
                        <div className={classes.param}>
                            {userInfo.tariff === 'free' ? 'Нет активного тарифа' : getTariffText(userInfo.tariff || 'free')}&nbsp;
                            (<span className={classes.link}
                                   onClick={() => navigate(RouteNames.P_TARIFF)}>изменить</span>)
                        </div>
                    </div>

                    <div className={classes.row}>
                        <div className={classes.label}>Дата окончания:</div>
                        <div className={classes.param}>
                            {userInfo.tariff !== 'free' ? getFormatDate(userInfo.tariffExpired) : 'Бессрочно'}
                        </div>
                    </div>
                </BlockingElement>
            </div>
        )
    }

    const renderArticlesInfo = (): React.ReactElement => {
        return (
            <div className={cx({'col': true, 'col-3': true})}>
                <Title type='h2'>Последние события</Title>

                <BlockingElement fetching={fetchingArticles} className={classes.list}>
                    {filterArticles && filterArticles.length ?
                        filterArticles.map((article: IArticle) => {
                            return (
                                <div key={article.id}
                                     className={classes.block}
                                     onClick={() => navigate(`${RouteNames.ARTICLE}/${article.id}`)}
                                >
                                    <Avatar href={article.avatar}
                                            alt={article.name}
                                            width={75}
                                            height={75}
                                    />

                                    <div className={classes.meta}>
                                        <div className={classes.title}>{article.name}</div>
                                        <div className={classes.date} title='Дата публикации'>
                                            <FontAwesomeIcon icon='calendar'/>
                                            <span>{getFormatDate(article.dateCreated)}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        : <Empty message='Нет активных событий.'/>
                    }
                </BlockingElement>
            </div>
        )
    }

    const renderTicketsInfo = (): React.ReactElement => {
        return (
            <div className={cx({'col': true, 'col-3': true})}>
                <Title type='h2'>Активные тикеты</Title>

                <BlockingElement fetching={fetchingTickets} className={classes.list}>
                    {tickets && tickets.length ?
                        tickets.map((ticket: IFeed) => {
                            return (
                                <div key={ticket.id}
                                     className={classes.block}
                                     onClick={() => {
                                         openPopupSupportInfo(document.body, {
                                             feedId: ticket.id,
                                             onSave: () => fetchFeedsHandler()
                                         })
                                     }}
                                >
                                    <div className={classes.name}>{ticket.title}</div>
                                    <div className={classes.date} title='Дата публикации'>
                                        <FontAwesomeIcon icon='calendar'/>
                                        <span>{getFormatDate(ticket.dateCreated)}</span>
                                    </div>
                                </div>
                            )
                        })
                        : <Empty message='Вы еще не связывались с технической поддержкой.'/>
                    }
                </BlockingElement>
            </div>
        )
    }

    const renderDealsInfo = (): React.ReactElement => {
        return (
            <div className={cx({'col': true, 'col-3': true})}>
                <Title type='h2'>Сделки</Title>

                <BlockingElement fetching={fetchingDeals} className={classes.list}>
                    {deals && deals.length ?
                        deals.map((deal: any, index: number) => {
                            return (
                                <div key={index}>

                                </div>
                            )
                        })
                        : <Empty message='У Вас еще нет совершенных сделок.'/>
                    }
                </BlockingElement>
            </div>
        )
    }

    const renderAgentsInfo = (): React.ReactElement => {
        const showAdd = allowForRole(['director', 'administrator', 'manager'], userInfo.role) || (allowForRole(['subscriber'], userInfo.role) && allowForTariff(['business', 'effectivePlus'], userInfo.tariff))
        const isDisable = allowForRole(['subscriber'], userInfo.role) && allowForTariff(['business'], userInfo.tariff) && agents.filter((agent: IAgent) => agent.active === 1).length > 0
        const emptyText = showAdd ? 'У Вас еще нет созданных агентств.' : 'На текущем тарифе не доступно.'

        return (
            <div className={cx({'col': true, 'col-3': true})}>
                <Title type='h2'
                       showAdd={showAdd}
                       onAdd={() => {
                           openPopupAgentCreate(document.body, {
                               isDisable: isDisable,
                               onSave: () => fetchAgentsHandler()
                           })
                       }}
                >Мои агентства</Title>

                <BlockingElement fetching={fetchingAgents} className={classes.list}>
                    {agents && agents.length ?
                        agents.map((agent: IAgent) => {
                            return (
                                <div key={agent.id}
                                     className={classes.block}
                                     onClick={() => {

                                     }}
                                     onContextMenu={(e: React.MouseEvent) => onContextMenuAgent(e, agent)}
                                >
                                    <div className={classes.name}>{agent.name}</div>
                                    <div className={classes.date} title='Дата публикации'>
                                        <FontAwesomeIcon icon='calendar'/>
                                        <span>{getFormatDate(agent.dateCreated)}</span>
                                    </div>
                                </div>
                            )
                        })
                        : <Empty message={emptyText}/>
                    }
                </BlockingElement>
            </div>
        )
    }

    const renderDevelopersInfo = (): React.ReactElement => {
        const showAdd = allowForRole(['director', 'administrator', 'manager'], userInfo.role) || (allowForRole(['subscriber'], userInfo.role) && allowForTariff(['business', 'effectivePlus'], userInfo.tariff))
        const isDisable = allowForRole(['subscriber'], userInfo.role) && allowForTariff(['business'], userInfo.tariff) && developers.filter((developer: IDeveloper) => developer.active === 1).length > 0
        const emptyText = showAdd ? 'У Вас еще нет созданных застройщиков.' : 'На текущем тарифе не доступно.'

        return (
            <div className={cx({'col': true, 'col-3': true})}>
                <Title type='h2'
                       showAdd={showAdd}
                       onAdd={() => {
                           openPopupDeveloperCreate(document.body, {
                               isDisable: isDisable,
                               onSave: () => fetchDevelopersHandler()
                           })
                       }}
                >Мои застройщики</Title>

                <BlockingElement fetching={fetchingDevelopers} className={classes.list}>
                    {developers && developers.length ?
                        developers.map((developer: IDeveloper) => {
                            return (
                                <div key={developer.id}
                                     className={classes.block}
                                     onClick={() => {

                                     }}
                                     onContextMenu={(e: React.MouseEvent) => onContextMenuDeveloper(e, developer)}
                                >
                                    <div className={classes.name}>{developer.name}</div>
                                    <div className={classes.date} title='Дата публикации'>
                                        <FontAwesomeIcon icon='calendar'/>
                                        <span>{getFormatDate(developer.dateCreated)}</span>
                                    </div>
                                </div>
                            )
                        })
                        : <Empty message={emptyText}/>
                    }
                </BlockingElement>
            </div>
        )
    }

    return (
        <PanelView pageTitle='Рабочий стол'>
            <Wrapper isFull>
                <Title type='h1'
                       className={classes.title}
                >Рабочий стол</Title>

                <BlockingElement fetching={false} className={classes.columns}>
                    {renderUserInfo()}
                    {renderTariffsInfo()}
                    {renderArticlesInfo()}
                    {renderDealsInfo()}
                    {renderAgentsInfo()}
                    {renderDevelopersInfo()}
                    {renderTicketsInfo()}
                </BlockingElement>
            </Wrapper>
        </PanelView>
    )
}

DesktopPage.displayName = 'DesktopPage'

export default React.memo(DesktopPage)