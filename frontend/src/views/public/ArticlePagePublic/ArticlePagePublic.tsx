import React, {useEffect, useState} from 'react'
import Helmet from 'react-helmet'
import classNames from 'classnames/bind'
import {useNavigate} from 'react-router-dom'
import {IArticle} from '../../../@types/IArticle'
import {ISelector} from '../../../@types/ISelector'
import {articleTypes} from '../../../helpers/articleHelper'
import ArticleService from '../../../api/ArticleService'
import BlockingElement from '../../../components/BlockingElement/BlockingElement'
import Empty from '../../../components/Empty/Empty'
import classes from './ArticlePagePublic.module.scss'

const cx = classNames.bind(classes)

const ArticlePagePublic: React.FC = () => {
    const navigate = useNavigate()
    const [isUpdate, setIsUpdate] = useState(true)
    const [articles, setArticles] = useState<IArticle[]>()
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

    const renderItem = (article: IArticle) => {
        const articleType = articleTypes.find((item: ISelector) => item.key === article.type)

        return (
            <div key={article.id} className={classes.item} onClick={() => navigate('/article/' + article.id)}>
                <div className={cx({'itemImage': true, 'noImage': !article.images || !article.images.length})}>
                    {article.images && article.images.length ?
                        <img src={'https://api.sochidominvest.ru' + article.images[0].value} alt={article.name}/>
                        : null
                    }
                </div>

                <div className={classes.itemContent}>
                    {articleType &&
                    <div className={classes.types}>
                        <div className={cx({'type': true, [`${article.type}`]: true})}>{articleType.text}</div>
                    </div>}

                    <h2>{article.name}</h2>

                    <p>{article.description.substring(0, 150)}</p>
                </div>
            </div>
        )
    }

    return (
        <main className={classes.ArticlePagePublic}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Статьи - СочиДомИнвест</title>
                <meta name='description' content=''/>
                <link rel='canonical' href={`${window.location.href}`}/>
            </Helmet>

            <div className={classes.Content}>
                <div className={classes.container}>
                    <h1><span>Статьи</span></h1>

                    <BlockingElement fetching={fetching} className={classes.list}>
                        {articles && articles.length ?
                            articles.map((article: IArticle) => renderItem(article))
                            : <Empty message='Нет статей'/>
                        }
                    </BlockingElement>
                </div>
            </div>
        </main>
    )
}

ArticlePagePublic.displayName = 'ArticlePagePublic'

export default ArticlePagePublic