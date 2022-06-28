import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useTypedSelector} from '../../../hooks/useTypedSelector'
import {useActions} from '../../../hooks/useActions'
import {getFormatDate} from '../../../helpers/dateHelper'
import UserService from '../../../api/UserService'
import FeedService from '../../../api/FeedService'
import {IUser} from '../../../@types/IUser'
import {IFeed} from '../../../@types/IFeed'
import {IArticle} from '../../../@types/IArticle'
import PageInfo from '../../../components/ui/PageInfo/PageInfo'
import Title from '../../../components/ui/Title/Title'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Empty from '../../../components/Empty/Empty'
import Avatar from '../../../components/ui/Avatar/Avatar'
import openPopupSupportInfo from '../../../components/PopupSupportInfo/PopupSupportInfo'
import classes from './DesktopPagePanel.module.scss'

const cx = classNames.bind(classes)

const DesktopPagePanel: React.FC = () => {
    const navigate = useNavigate()

    const [isUpdate, setIsUpdate] = useState(true)
    const [userInfo, setUserInfo] = useState<IUser>({} as IUser)
    const [tariffs, setTariffs] = useState(null)
    const [tickets, setTickets] = useState<IFeed[]>([])
    const [deals, setDeals] = useState([])
    const [filterArticles, setFilterArticles] = useState<IArticle[]>([])

    const [fetchingUser, setFetchingUser] = useState(false)
    const [fetchingTariffs, setFetchingTariffs] = useState(false)
    const [fetchingTickets, setFetchingTickets] = useState(false)
    const [fetchingDeals, setFetchingDeals] = useState(false)

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
        return (
            <div className={cx({'col': true, 'col-3': true})}>
                <Title type={2}>Тарифный план</Title>

                <BlockingElement fetching={fetchingTariffs} className={classes.list}>
                    <div className={classes.row}>
                        <div className={classes.label}>Текущий тариф:</div>
                        <div className={classes.param}>Базовый</div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.label}>Дата окончания:</div>
                        <div className={classes.param}>Бессрочно</div>
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
                    {filterArticles && filterArticles.length ? filterArticles.map((article: IArticle) => {
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
            <div className={cx({'col': true, 'col-2': true})}>
                <Title type={2}>Активные тикеты</Title>

                <BlockingElement fetching={fetchingTickets} className={classes.list}>
                    {tickets && tickets.length ? tickets.map((ticket: IFeed) => {
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
            <div className={cx({'col': true, 'col-2': true})}>
                <Title type={2}>Сделки</Title>

                <BlockingElement fetching={fetchingDeals} className={classes.list}>
                    {deals && deals.length ? deals.map((deal: any, index: number) => {
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

    return (
        <div className={classes.DesktopPagePanel}>
            <PageInfo title='Авторизованный брокер недвижимости Сочи'/>

            <div className={classes.Content}>
                <Title type={1}>Рабочий стол</Title>

                <div className={classes.columns}>
                    {renderUserInfo()}
                    {renderTariffsInfo()}
                    {renderArticlesInfo()}
                    {renderDealsInfo()}
                    {renderTicketsInfo()}
                </div>
            </div>
        </div>
    )
}

DesktopPagePanel.displayName = 'DesktopPagePanel'

export default DesktopPagePanel