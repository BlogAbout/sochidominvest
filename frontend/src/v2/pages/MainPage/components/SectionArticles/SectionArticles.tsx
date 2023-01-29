import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {RouteNames} from '../../../../helpers/routerHelper'
import {getArticleTypeText} from '../../../../../helpers/articleHelper'
import {IArticle} from '../../../../../@types/IArticle'
import Wrapper from '../../../../components/ui/Wrapper/Wrapper'
import ArticleService from '../../../../../api/ArticleService'
import Title from '../../../../components/ui/Title/Title'
import Button from '../../../../components/form/Button/Button'
import BlockingElement from '../../../../../components/ui/BlockingElement/BlockingElement'
import Empty from '../../../../components/ui/Empty/Empty'
import BlockItem from '../../../../components/ui/BlockItem/BlockItem'
import classes from './SectionArticles.module.scss'

const SectionArticles: React.FC = (): React.ReactElement => {
    const navigate = useNavigate()

    const [isUpdate, setIsUpdate] = useState(true)
    const [fetching, setFetching] = useState(false)
    const [articles, setArticles] = useState<IArticle[]>([])

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

    const renderItems = () => {
        const showArticles: IArticle[] = []

        for (let i = 0; i < 3; i++) {
            showArticles.push(articles[i])
        }

        return showArticles.map((article: IArticle) => {
            return (
                <BlockItem key={article.id}
                           title={article.name}
                           avatar={article.avatar || ''}
                           description={article.description}
                           date={article.dateCreated || undefined}
                           type={getArticleTypeText(article.type)}
                           isDisabled={!article.active}
                           onContextMenu={() => {}}
                           onClick={() => navigate(`${RouteNames.ARTICLE}/${article.id}`)}
                />
            )
        })
    }

    return (
        <section className={classes.SectionArticles}>
            <Wrapper>
                <div className={classes.inner}>
                    <Title type='h2' style='center'>Последние новости и события</Title>

                    <BlockingElement fetching={fetching} className={classes.list}>
                        {articles.length ? renderItems() : <Empty message='Нет статей'/>}
                    </BlockingElement>

                    <div className={classes.buttons}>
                        <Button type='apply' onClick={() => navigate(RouteNames.ARTICLE)}>Смотреть все</Button>
                    </div>
                </div>
            </Wrapper>
        </section>
    )
}

SectionArticles.displayName = 'SectionArticles'

export default SectionArticles