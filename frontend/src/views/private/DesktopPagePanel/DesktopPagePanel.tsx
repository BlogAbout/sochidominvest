import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {getFormatDate} from '../../../helpers/dateHelper'
import UserService from '../../../api/UserService'
import FeedService from '../../../api/FeedService'
import DeveloperService from '../../../api/DeveloperService'
import AgentService from '../../../api/AgentService'
import {IUser} from '../../../@types/IUser'
import {IFeed} from '../../../@types/IFeed'
import {IArticle} from '../../../@types/IArticle'
import {IDeveloper} from '../../../@types/IDeveloper'
import {IAgent} from '../../../@types/IAgent'
import PageInfo from '../../../components/ui/PageInfo/PageInfo'
import Title from '../../../components/ui/Title/Title'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Empty from '../../../components/Empty/Empty'
import Avatar from '../../../components/ui/Avatar/Avatar'
import openPopupSupportInfo from '../../../components/popup/PopupSupportInfo/PopupSupportInfo'
import openPopupDeveloperCreate from '../../../components/popup/PopupDeveloperCreate/PopupDeveloperCreate'
import openPopupAgentCreate from '../../../components/popup/PopupAgentCreate/PopupAgentCreate'
import classes from './DesktopPagePanel.module.scss'
import {getTariffText} from "../../../helpers/tariffHelper";

const cx = classNames.bind(classes)

const DesktopPagePanel: React.FC = () => {
    const navigate = useNavigate()

    const [isUpdate, setIsUpdate] = useState(true)
    const [userInfo, setUserInfo] = useState<IUser>({} as IUser)
    const [tickets, setTickets] = useState<IFeed[]>([])
    const [deals, setDeals] = useState([])
    const [agents, setAgents] = useState<IAgent[]>([])
    const [developers, setDevelopers] = useState<IDeveloper[]>([])
    const [filterArticles, setFilterArticles] = useState<IArticle[]>([])

    const [fetchingUser, setFetchingUser] = useState(false)
    const [fetchingTariffs, setFetchingTariffs] = useState(false)
    const [fetchingTickets, setFetchingTickets] = useState(false)
    const [fetchingDeals, setFetchingDeals] = useState(false)
    const [fetchingAgents, setFetchingAgents] = useState(false)
    const [fetchingDevelopers, setFetchingDevelopers] = useState(false)

    const {userId} = useTypedSelector(state => state.userReducer)
    const {articles, fetching: fetchingArticles} = useTypedSelector(state => state.articleReducer)
    const {fetchArticleList} = useActions()

    useEffect(() => {
        if (!articles || !articles.length || isUpdate) {
            fetchArticleList({active: [0, 1]})
        }

        if (userId && isUpdate) {
            setFetchingUser(true)
            UserService.fetchUserById(userId)
                .then((response: any) => {
                    setUserInfo(response.data)
                })
                .catch((error: any) => {
                    console.error('Ошибка загрузки данных пользователя', error)
                })
                .finally(() => {
                    setFetchingUser(false)
                })

            setFetchingTickets(true)
            FeedService.fetchFeeds({active: [1], author: [userId]})
                .then((response: any) => {
                    setTickets(response.data)
                })
                .catch((error: any) => {
                    console.error('Ошибка загрузки тикетов пользователя', error)
                })
                .finally(() => {
                    setFetchingTickets(false)
                })
        }

        if (isUpdate) {

        }

        setIsUpdate(false)
    }, [isUpdate, userId])

    useEffect(() => {
        if (!articles || !articles.length) {
            setFilterArticles([])
        } else {
            setFilterArticles(articles.filter((article: IArticle) => article.active === 1))
        }
    }, [articles])

    useEffect(() => {
        if (userInfo && (userInfo.role !== 'subscriber' || (['free', 'base'].includes(userInfo.tariff || 'free')))) {
            loadDevelopersHandler()
            loadAgentsHandler()
        }
    }, [userInfo])

    // Загрузка данных о застройщиках
    const loadDevelopersHandler = () => {
        setFetchingDevelopers(true)

        DeveloperService.fetchDevelopers({active: [0, 1], author: [userId]})
            .then((response: any) => {
                setDevelopers(response.data)
            })
            .catch((error: any) => {
                console.error('Ошибка загрузки застройщиков пользователя', error)
            })
            .finally(() => {
                setFetchingDevelopers(false)
            })
    }

    const loadAgentsHandler = () => {
        setFetchingAgents(true)

        AgentService.fetchAgents({active: [0, 1], author: [userId]})
            .then((response: any) => {
                setAgents(response.data)
            })
            .catch((error: any) => {
                console.error('Ошибка загрузки агентств пользователя', error)
            })
            .finally(() => {
                setFetchingAgents(false)
            })
    }

    const renderUserInfo = () => {
        return (
            <div className={cx({'col': true, 'col-3': true})}>
                <Title type={2}>Личная информация</Title>

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

    const renderTariffsInfo = () => {
        if (!userInfo || userInfo.role !== 'subscriber') {
            return null
        }

        return (
            <div className={cx({'col': true, 'col-3': true})}>
                <Title type={2}>Тарифный план</Title>

                <BlockingElement fetching={fetchingTariffs} className={classes.list}>
                    <div className={classes.row}>
                        <div className={classes.label}>Текущий тариф:</div>
                        <div className={classes.param}>
                            {userInfo.tariff === 'free' ? 'Нет активного тарифа' : getTariffText(userInfo.tariff || 'free')}&nbsp;
                            (<span className={classes.link}
                                   onClick={() => navigate('/panel/tariff/')}>изменить</span>)
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

    const renderArticlesInfo = () => {
        return (
            <div className={cx({'col': true, 'col-3': true})}>
                <Title type={2}>Последние события</Title>

                <BlockingElement fetching={fetchingArticles} className={classes.list}>
                    {filterArticles && filterArticles.length ?
                        filterArticles.map((article: IArticle) => {
                            return (
                                <div key={article.id}
                                     className={classes.block}
                                     onClick={() => navigate('/panel/article/' + article.id)}
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

    const renderTicketsInfo = () => {
        return (
            <div className={cx({'col': true, 'col-3': true})}>
                <Title type={2}>Активные тикеты</Title>

                <BlockingElement fetching={fetchingTickets} className={classes.list}>
                    {tickets && tickets.length ?
                        tickets.map((ticket: IFeed) => {
                            return (
                                <div key={ticket.id}
                                     className={classes.block}
                                     onClick={() => {
                                         openPopupSupportInfo(document.body, {
                                             feedId: ticket.id,
                                             onSave: () => setIsUpdate(true)
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

    const renderDealsInfo = () => {
        return (
            <div className={cx({'col': true, 'col-3': true})}>
                <Title type={2}>Сделки</Title>

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

    const renderAgentsInfo = () => {
        return (
            <div className={cx({'col': true, 'col-3': true})}>
                <Title type={2}
                       showAdd={userInfo && (userInfo.role !== 'subscriber' || (['free', 'base'].includes(userInfo.tariff || 'free')))}
                       onAdd={() => {
                           openPopupAgentCreate(document.body, {
                               isDisable: userInfo.role === 'subscriber' && userInfo.tariff === 'business' && agents.filter((agent: IAgent) => agent.active === 1).length > 0,
                               onSave: () => loadAgentsHandler()
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
                                >
                                    <div className={classes.name}>{agent.name}</div>
                                    <div className={classes.date} title='Дата публикации'>
                                        <FontAwesomeIcon icon='calendar'/>
                                        <span>{getFormatDate(agent.dateCreated)}</span>
                                    </div>
                                </div>
                            )
                        })
                        : <Empty
                            message={userInfo && (userInfo.role !== 'subscriber' || (['free', 'base'].includes(userInfo.tariff || 'free'))) ? 'У Вас еще нет созданных агентств.' : 'На текущем тарифе не доступно.'}/>
                    }
                </BlockingElement>
            </div>
        )
    }

    const renderDevelopersInfo = () => {
        return (
            <div className={cx({'col': true, 'col-3': true})}>
                <Title type={2}
                       showAdd={userInfo && (userInfo.role !== 'subscriber' || (['free', 'base'].includes(userInfo.tariff || 'free')))}
                       onAdd={() => {
                           openPopupDeveloperCreate(document.body, {
                               isDisable: userInfo.role === 'subscriber' && userInfo.tariff === 'business' && developers.filter((developer: IDeveloper) => developer.active === 1).length > 0,
                               onSave: () => loadDevelopersHandler()
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
                                >
                                    <div className={classes.name}>{developer.name}</div>
                                    <div className={classes.date} title='Дата публикации'>
                                        <FontAwesomeIcon icon='calendar'/>
                                        <span>{getFormatDate(developer.dateCreated)}</span>
                                    </div>
                                </div>
                            )
                        })
                        : <Empty
                            message={userInfo && (userInfo.role !== 'subscriber' || (['free', 'base'].includes(userInfo.tariff || 'free'))) ? 'У Вас еще нет созданных застройщиков.' : 'На текущем тарифе не доступно.'}/>
                    }
                </BlockingElement>
            </div>
        )
    }

    return (
        <div className={classes.DesktopPagePanel}>
            <PageInfo title='Авторизованный брокер недвижимости Сочи'/>

            <div className={classes.Content}>
                <Title type={1}>Рабочий стол</Title>

                <BlockingElement fetching={false} className={classes.columns}>
                    {renderUserInfo()}
                    {renderTariffsInfo()}
                    {renderArticlesInfo()}
                    {renderDealsInfo()}
                    {renderAgentsInfo()}
                    {renderDevelopersInfo()}
                    {renderTicketsInfo()}
                </BlockingElement>
            </div>
        </div>
    )
}

DesktopPagePanel.displayName = 'DesktopPagePanel'

export default DesktopPagePanel