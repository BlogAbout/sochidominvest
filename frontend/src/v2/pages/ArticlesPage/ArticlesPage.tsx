import React, {useEffect, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import ArticleService from '../../../api/ArticleService'
import {IArticle} from '../../../@types/IArticle'
import {IFilterBase} from '../../../@types/IFilter'
import BlockingElement from '../../../components/ui/BlockingElement/BlockingElement'
import Empty from '../../components/ui/Empty/Empty'
import FilterBase from '../../../components/ui/FilterBase/FilterBase'
import Title from '../../components/ui/Title/Title'
import Wrapper from '../../components/ui/Wrapper/Wrapper'
import DefaultView from '../../views/DefaultView/DefaultView'
import ArticleItem from './components/ArticleItem/ArticleItem'
import classes from './ArticlesPage.module.scss'

const ArticlesPage: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [isUpdate, setIsUpdate] = useState(true)
    const [articles, setArticles] = useState<IArticle[]>()
    const [filterArticle, setFilterArticle] = useState<IArticle[]>([])
    const [selectedType, setSelectedType] = useState<string>('all')
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        if (isUpdate) {
            onFetchArticles()
        }
    }, [isUpdate])

    useEffect(() => {
        onFiltrationArticles()
    }, [articles, selectedType])

    // Загрузка списка статей
    const onFetchArticles = (): void => {
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

    // Фильтрация статей
    const onFiltrationArticles = (): void => {
        if (!articles || !articles.length) {
            setFilterArticle([])
        } else if (!selectedType || selectedType === 'all') {
            setFilterArticle(articles)
        } else {
            setFilterArticle(articles.filter((article: IArticle) => article.type === selectedType))
        }
    }

    // Массив кнопок для фильтра
    const filterBaseButtons: IFilterBase[] = useMemo(() => {
        return [
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
    }, [selectedType])

    return (
        <DefaultView pageTitle='Статьи'>
            <Wrapper>
                <div className={classes.inner}>
                    <Title type='h1' style='center'>Статьи</Title>

                    <FilterBase buttons={filterBaseButtons}/>

                    <BlockingElement fetching={fetching} className={classes.list}>
                        {filterArticle && filterArticle.length ?
                            filterArticle.map((article: IArticle) => {
                                return (
                                    <ArticleItem article={article}
                                                 onClick={() => navigate('/article/' + article.id)}
                                    />
                                )
                            })
                            : <Empty message='Нет статей'/>
                        }
                    </BlockingElement>
                </div>
            </Wrapper>
        </DefaultView>
    )
}

ArticlesPage.displayName = 'ArticlesPage'

export default ArticlesPage