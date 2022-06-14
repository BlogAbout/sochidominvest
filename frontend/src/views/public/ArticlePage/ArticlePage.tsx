import React, {useEffect, useState} from 'react'
import * as Showdown from 'showdown'
import classNames from 'classnames/bind'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useNavigate} from 'react-router-dom'
import {IArticle} from '../../../@types/IArticle'
import {ISelector} from '../../../@types/ISelector'
import {IFilterBase} from '../../../@types/IFilter'
import {articleTypes} from '../../../helpers/articleHelper'
import ArticleService from '../../../api/ArticleService'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Empty from '../../../components/Empty/Empty'
import PageInfo from '../../../components/ui/PageInfo/PageInfo'
import FilterBase from '../../../components/ui/FilterBase/FilterBase'
import Title from '../../../components/ui/Title/Title'
import classes from './ArticlePage.module.scss'

const cx = classNames.bind(classes)

const ArticlePage: React.FC = () => {
    const navigate = useNavigate()
    const [isUpdate, setIsUpdate] = useState(true)
    const [articles, setArticles] = useState<IArticle[]>()
    const [filterArticle, setFilterArticle] = useState<IArticle[]>([])
    const [selectedType, setSelectedType] = useState<string>('all')
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        if (isUpdate) {
            setFetching(true)

            ArticleService.fetchArticles({active: [1], publish: 1})
                .then((response: any) => {
                    setArticles(response.data)
                })
                .catch((error: any) => {
                    console.error('Произошла ошибка загрузки данных', error)
                })
                .finally(() => {
                    setFetching(false)
                    setIsUpdate(false)
                })
        }
    }, [isUpdate])

    useEffect(() => {
        onFiltrationArticles()
    }, [articles, selectedType])

    const onFiltrationArticles = () => {
        if (!articles || !articles.length) {
            setFilterArticle([])
        } else if (!selectedType || selectedType === 'all') {
            setFilterArticle(articles)
        } else {
            setFilterArticle(articles.filter((article: IArticle) => article.type === selectedType))
        }
    }

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    })

    const filterBaseButtons: IFilterBase[] = [
        {
            key: 'all',
            title: 'Все',
            icon: 'bookmark',
            active: selectedType.includes('all'),
            onClick: () => setSelectedType('all')
        },
        {
            key: 'news',
            title: 'Новости',
            icon: 'bolt',
            active: selectedType.includes('news'),
            onClick: () => setSelectedType('news')
        },
        {
            key: 'action',
            title: 'Акции',
            icon: 'percent',
            active: selectedType.includes('action'),
            onClick: () => setSelectedType('action')
        },
        {
            key: 'article',
            title: 'Статьи',
            icon: 'star',
            active: selectedType.includes('article'),
            onClick: () => setSelectedType('article')
        }
    ]

    const renderItem = (article: IArticle) => {
        const articleType = articleTypes.find((item: ISelector) => item.key === article.type)

        return (
            <div key={article.id} className={classes.item} onClick={() => navigate('/article/' + article.id)}>
                <div className={cx({'itemImage': true, 'noImage': !article.images || !article.images.length})}>
                    {article.avatar ?
                        <img src={'https://api.sochidominvest.ru/uploads/image/thumb/' + article.avatar}
                             alt={article.name}/>
                        : null
                    }
                </div>

                <div className={classes.itemContent}>
                    {articleType &&
                    <div className={classes.types}>
                        <div className={cx({'type': true, [`${article.type}`]: true})}>{articleType.text}</div>
                    </div>}

                    <div className={classes.information}>
                        <div className={classes.icon} title={`Просмотры: ${article.views}`}>
                            <FontAwesomeIcon icon='eye'/>
                            <span>{article.views}</span>
                        </div>

                        <div className={classes.icon} title={`Дата публикации: ${article.dateCreated}`}>
                            <FontAwesomeIcon icon='calendar'/>
                            <span>{article.dateCreated}</span>
                        </div>

                        {article.authorName ?
                            <div className={classes.icon} title={`Автор: ${article.authorName}`}>
                                <FontAwesomeIcon icon='user'/>
                                <span>{article.authorName}</span>
                            </div>
                            : null}
                    </div>

                    <h2>{article.name}</h2>

                    <div className={classes.description}
                         dangerouslySetInnerHTML={{__html: converter.makeHtml(article.description.substring(0, 150))}}
                    />
                </div>
            </div>
        )
    }

    return (
        <main className={classes.ArticlePage}>
            <PageInfo title='Статьи'/>

            <FilterBase buttons={filterBaseButtons}/>

            <div className={classes.Content}>
                <div className={classes.container}>
                    <Title type={1}>Статьи</Title>

                    <BlockingElement fetching={fetching} className={classes.list}>
                        {filterArticle && filterArticle.length ?
                            filterArticle.map((article: IArticle) => renderItem(article))
                            : <Empty message='Нет статей'/>
                        }
                    </BlockingElement>
                </div>
            </div>
        </main>
    )
}

ArticlePage.displayName = 'ArticlePage'

export default ArticlePage